import chalk from 'chalk';
import { Command } from 'commander';
import enquirer from 'enquirer';
import fse from 'fs-extra';
import { join } from 'path';
import { assertType } from 'typescript-is';
import strftime from 'strftime';
import yaml from 'yaml';
import defaults from './defaults.js';
import backup from './backup.js';
import { p9e, fileDirname, getAppMap } from '../utils.js';
import { Data, App, Settled } from '../types.js';

const program = new Command();

program
  .option('-h, --help', `
\tShows this help prompt.

\t${chalk.italic('Is (ovbviously) disabled by default.')}
`)
  .option('-V, --version', `
\tShows the version number.

\t${chalk.italic('Is (ovbviously) disabled by default.')}
`)
  .option('-a, --all', `
\tSelects all programs. Cannot be used with -o or -s.

\t${chalk.italic('Is enabled by default.')}
`)
  .option('-s, --skip <programs to skip backuping>', `
\tSelects programs to skip backuping, separated by a comma (and no space after that). Cannot be used with -o or -a.

\t${chalk.italic('See -a for default.')}
`)
  .option('-o, --only <only programs to backup>', `
\tSelects only programs to back up. Cannot be used with -s or -a.

\t${chalk.italic('See -a for default.')}
`)
  .option('-L, --location <file location>', `
\tSelects a custom location where to store the ZIP file / directory. See https://strftime.org/ for info on date and time inclusion.

\t${chalk.italic(`Default: ${defaults.location}.`)}
`)
  .option('-c, --no-command-line', `
\tDisables command line input. Uses default for unprovided data.

\t${chalk.italic('Is not enabled by default.')}
`)
  .option('-Z, --compression', `
\tSelects a custom location where to store your backup files.
\tPossible values: zip, tgz, none.

\t${chalk.italic(`Default: ${defaults.compression}.`)}
`)
  .parse();

const options = program.opts();

if (options.help) {
  console.log(`${chalk.underline.bold('Usage:')}
npx backup [options]

${chalk.underline.bold('Options:')}
${(program.helpInformation().match(/(?<=Options:\n)[^]+$/) as unknown[])[0]}`);
  process.exit();
} else if (options.version) {
  fse.readJSON(join(fileDirname, '../package.json'))
    .then((pkgInfo) => {
      console.log(options.commandLine ? `Version ${chalk.underline(pkgInfo.version)}` : pkgInfo.version);
      process.exit();
    });
} else {
  (async () => {
    const parseData = async (): Promise<Data> => {
      const fileContents: string = await fse.readFile(join(fileDirname, '../data.yml'), 'utf8');
      const object: Data = assertType<Data>(
        yaml.parse(fileContents, { prettyErrors: true }),
      );
      return object;
    };

    const programs = Object.entries({
      s: options.skip,
      a: options.all,
      o: options.only,
    }).filter(([,v]) => v); // Check which exist

    if (programs.length > 1) throw new Error(`Options ${programs.map(([v]) => `-${v}`).join(', ').replace(/, -(.)$/, ' and -$1')} cannot be used together`);

    const currentDate = new Date(Date.now());
    const backupData: Data = await parseData();
    const appMap = getAppMap(backupData.apps);
    const possiblePrograms = [...appMap.entries()].filter(([, v]: [string, App]) => 'move' in v).map(([id]: [string, App]) => id);
    if (options.all) {
      options.programs = possiblePrograms;
    } else if (options.only) {
      options.programs = options.only === '*'
        ? possiblePrograms
        : possiblePrograms.filter((v) => options.only.split(',').includes(v));
    } else if (options.skip) {
      options.programs = options.skip === '*'
        ? []
        : possiblePrograms.filter((v) => !options.skip.split(',').includes(v));
    }

    const symbols = {
      prefix: {
        pending: '?',
        submitted: '√',
        cancelled: '×',
      },
    };

    const toPrompt = [
      {
        type: 'select',
        multiple: true,
        name: 'programs',
        message: 'What programs should be backed up?',
        indicator(state: Record<string, unknown>, choice: Record<string, unknown>) {
          return choice.enabled ? '☒' : '☐';
        },
        choices: [...appMap.entries()].map(([id, v]: [string, App]) => ({
          message: ('move' in v) ? v.name : chalk.gray(v.name),
          name: id,
          disabled: !('move' in v),
        })),
        initial: [...appMap.entries()].filter(([,v]: [string, App]) => 'move' in v).map(([id]: [string, App]) => id),
        disabled: options.only || options.all || options.skip,
        symbols,
        footer: () => chalk.gray('The list of programs is in data.yml'),
      },
      {
        type: 'input',
        name: 'filepath',
        message: 'Where should the backup be located? (Filename not included)',
        initial: defaults.location,
        disabled: options.location,
        symbols,
        footer: (a: any) => chalk.gray(join(p9e(fileDirname), p9e`../`, strftime(a.input || defaults.location, currentDate))),
      },
      {
        type: 'input',
        name: 'filename',
        message: 'What should the backup be named? (File ext not included)',
        initial: defaults.filename,
        disabled: options.location,
        symbols,
        footer: (a: any) => chalk.gray(strftime(a.input || defaults.filename, currentDate)),
        validate: (str: string) => !str.match(/\/|\\/g),
      },
      {
        type: 'select',
        name: 'compression',
        message: 'What compression type should be used for the backup?',
        choices: [
          { message: '.zip (Common in windows and mac)', name: 'zip' },
          { message: '.tar.gz (Common in linux and unix-like systems)', name: 'tgz' },
          { message: '<None> (Useful if version control software is used around the backup)', name: 'none' },
        ],
        pointer: '❯',
        initial: defaults.compression,
        disabled: options.compression,
        symbols,
        footer: () => chalk.gray(`If unsure, just use ${chalk.bold('.zip')}: it is supported by most`),
      },
    ].filter((v) => !v.disabled).map((v) => {
      v.disabled = undefined;
      return v;
    });
    let prompted: any;
    try {
      if (options.commandLine) {
        console.log(`${chalk.bold.green('[INFO]')} The file location and file name are both formatted using strftime.
You can get information on how to use it on https://strftime.org/
`);
        prompted = await enquirer.prompt(toPrompt);
      } else prompted = {};
    } catch (err) {
      process.exit();
    }
    delete options.commandLine;

    const settled: Settled = {
      programs: options.programs || prompted.programs || possiblePrograms,
      fileLocation: options.location || join(
        fileDirname,
        '../',
        strftime(p9e(prompted.location || defaults.location), currentDate),
        strftime(p9e(prompted.filename || defaults.filename), currentDate),
      ),
      compression: options.compression || prompted.compression || defaults.compression,
    };
    backup(settled, backupData);
  })();
}

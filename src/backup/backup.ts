import execa from 'execa';
import fse from 'fs-extra';
import { dirname, basename, join } from 'path';
import glob from 'glob';
import picomatch from 'picomatch';
import ora from 'ora';
import enquirer from 'enquirer';
import strftime from 'strftime';
import chalk from 'chalk';
import { assertType } from 'typescript-is';
import yaml from 'yaml';
import { fileURLToPath } from 'url';
import { p9e } from '../utils.js';
import defaults from './defaults.js';
import program from './program.js';
import {
  Data,
  App,
  Move,
  PlatformDependant,
  Platform,
  MaybeArray,
} from '../types';

const fileDirname = dirname(fileURLToPath(import.meta.url));

const parseData = async (): Promise<Data> => {
  const fileContents: string = await fse.readFile(join(fileDirname, '../../data.yml'), 'utf8');
  const object: Data = assertType<Data>(
    yaml.parse(fileContents, { prettyErrors: true }),
  );
  return object;
};

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
}

const programs = Object.entries({
  s: options.skip,
  a: options.all,
  o: options.only,
}).filter(([,v]) => v); // Check which exist

if (programs.length > 1) throw new Error(`Options ${programs.map(([v]) => `-${v}`).join(', ').replace(/, -(.)$/, ' and -$1')} cannot be used together`);

(async () => {
  const currentDate = new Date(Date.now());
  const backupData: Data = await parseData();
  const appMap = new Map(backupData.apps.map((v: App) => [v.id, { ...v }]));
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

  interface Settled {
    programs: string[];
    fileLocation: string;
    location?: string;
    filename?: string;
    compression: 'zip' | 'tgz' | 'none';
  }

  const settled: Settled = {
    programs: options.programs || prompted.programs || possiblePrograms,
    fileLocation: options.location || join(
      fileDirname,
      '../../',
      strftime(p9e(prompted.location || defaults.location), currentDate),
      strftime(p9e(prompted.filename || defaults.filename), currentDate),
    ),
    compression: options.compression || prompted.compression || defaults.compression,
  };

  settled.location = join(settled.fileLocation, '../');
  settled.filename = basename(settled.fileLocation);

  const tempFolder = join(settled.location, `${settled.filename}.temp`);

  await fse.mkdirp(tempFolder);

  const appsCopySpinner = ora({ text: 'Copying apps...', spinner: 'bouncingBall' }).start();
  await fse.mkdirp(join(tempFolder, 'apps'));

  const sys = process.platform;
  const sysMap = Object.fromEntries(Object.entries<Platform[]>({
    aix: ['unix'],
    android: ['linux', 'gnu/linux', 'unix-like'],
    darwin: ['mac', 'macos', 'unix-like'],
    freebsd: ['bsd', 'unix', 'unix-like'],
    haiku: ['beos'],
    linux: ['gnu/linux', 'unix-like'],
    openbsd: ['bsd', 'unix', 'unix-like'],
    sunos: ['bsd', 'unix', 'unix-like'],
    win32: ['windows', 'winnt', 'windowsnt'],
    cygwin: ['linux', 'gnu/linux', 'unix-like'],
  })
    .map(([k, v]: [string, Platform[]]) => [k, [k, ...v, 'all']])) as Record<NodeJS.Platform, Platform[]>; // Add itself and 'all' to the sysMap
  const appTransferData = await Promise.all(settled.programs.map(async (appId: string) => {
    const app = appMap.get(appId) as App;
    if (app.move == null) app.move = [];
    if (!Array.isArray(app.move)) app.move = [app.move];
    appsCopySpinner.text = `Copying app ${app.name}...`;
    const toReturn = await Promise.all((app.move as unknown as Move[]).map(async (move: Move) => {
      const convertIfPlatformDependant = (
        v: MaybeArray<string | PlatformDependant<string>>,
      ): (
        string | undefined
        )[] => {
        if (typeof v === 'string') return [v];
        if (Array.isArray(v)) return v.map((v1) => convertIfPlatformDependant(v1)[0]);
        for (let i = 0; i < sysMap[sys].length; i += 1) {
          if (sysMap[sys][i] in v) return [v[sysMap[sys][i]]];
        }
        return [undefined];
      };
      const globs: string[] = convertIfPlatformDependant(move.glob).map((v, i) => {
        console.log(v);
        if (!v) console.warn(`${chalk.yellow.bold('[WARN]')} Glob #${i} of ${app.name}.move does not have an entry for ${sysMap[sys].slice(0, sysMap[sys].length - 2)} or ${sysMap[sys][sysMap[sys].length - 2]}`);
        return v;
      }).filter((v) => v != null) as string[];
      const actualGlobs = await Promise.all(
        globs.map(async (currentGlob) => {
          const globNormal = await execa('echo', [currentGlob], { shell: true }).then(({ stdout }) => {
            console.log(p9e(stdout.trim(), '/'));
            return p9e(stdout.trim(), '/');
          });
          console.log({ currentGlob, globNormal });
          return globNormal;
        }),
      );
      const toCopy = await Promise.all(
        globs.map(async (globPattern) => { // just let me return my await already
          const toReturn2 = await new Promise((res, rej) => glob(
            globPattern, (er, files) => {
              if (er) return rej(er);
              return res(files);
            },
          ));
          return toReturn2;
        }),
      );
      /* toCopy.forEach(() => {
        await fse.copy();
      }); */
      console.log(actualGlobs, toCopy);
    }));
    return toReturn;
  }));
  console.log(backupData, appMap);
})();

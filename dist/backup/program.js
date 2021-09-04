import chalk from 'chalk';
import { Command } from 'commander';
import defaults from './defaults.js';
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
export default program;

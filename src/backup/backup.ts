import crypto from 'crypto-js';
import execa from 'execa';
import fse from 'fs-extra';
import { join, basename } from 'path';
import glob from 'glob';
import micromatch from 'micromatch';
import ora from 'ora';
import chalk from 'chalk';
import { Settled, Data } from '../types.js';

import {
  App,
  Move,
  PlatformDependant,
  Platform,
  MaybeArray,
} from '../types';
import { getAppMap, mapAsync } from '../utils.js';

export default async (settled: Settled, backupData: Data) => {
  settled.location = join(settled.fileLocation, '../');
  settled.filename = basename(settled.fileLocation);

  const appMap = getAppMap(backupData.apps);

  const tempFolder = join(settled.location, `${settled.filename}.temp`);

  await fse.mkdirp(tempFolder);

  let currentSpinner = ora({ text: 'Copying apps...', spinner: 'bouncingBall' }).start();
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
  const appTransferData = Object.fromEntries(await mapAsync(settled.programs, async (appId: string) => {
    const app = appMap.get(appId) as App;
    if (app.move == null) app.move = [];

    if (!Array.isArray(app.move)) app.move = [app.move];
    currentSpinner.text = `Copying app ${app.name}...`;

    const toReturn = await mapAsync(
      app.move as Move[], async (move: Move, moveIndex: number) => {
        const convertIfPlatformDependant = (
          v: MaybeArray<string | PlatformDependant<string>>,
        ): (
          string | undefined
          )[] => {
          if (typeof v === 'string') return [v];
          if (Array.isArray(v)) return v.map((v1) => convertIfPlatformDependant(v1)[0]);

          const matchedPlatformName = sysMap[sys].find((v1) => v1 in v);
          if (matchedPlatformName != null) return [v[matchedPlatformName]];
          return [undefined];
        };

        const globs: string[] = convertIfPlatformDependant(move.glob).map((v, i) => {
          if (!v) console.warn(`${chalk.yellow.bold('[WARN]')} Glob #${i} of ${app.name}.move does not have an entry for ${sysMap[sys].slice(0, sysMap[sys].length - 2)} or ${sysMap[sys][sysMap[sys].length - 2]}`);
          return v;
        }).filter((v) => v != null) as string[];
        const actualGlobs = await Promise.all(
          globs.map(async (currentGlob) => {
            const globNormal = await execa(
              'echo',
              [currentGlob],
              { shell: true },
            ).then(({ stdout }) => (process.platform === 'win32' ? stdout.replace(/\\/g, '/') : stdout));

            // console.log({ currentGlob, globNormal });
            return globNormal;
          }),
        );
        const toCopy: string[][] = await Promise.all(
          actualGlobs.map(async (globPattern): Promise<string[]> => {
            // just let me return my await already
            const toReturn2 = await new Promise<string[]>((res, rej) => glob(
              globPattern, (er, files) => {
                if (er) return rej(er);
                return res(files);
              },
            ));
            return toReturn2;
          }),
        );

        const actuallyCopy = async (globResult: string, currentRawGlobPattern: string) => {
          await fse.copy(
            globResult,
            join(
              tempFolder,
              'apps',
              app.id,
              crypto.enc.Hex.stringify(crypto.SHA256(currentRawGlobPattern)).slice(0, 6),
              crypto.enc.Hex.stringify(crypto.SHA256(globResult)).slice(0, 6),
            ),
          );
          return [crypto.enc.Hex.stringify(crypto.SHA256(globResult)).slice(0, 6), globResult];
        };

        const results = await Promise.all(
          toCopy.map(async (globResults: string[], globIndex: number) => {
            const toReturn2 = await Promise.all(
              globResults.map(async (globResult: string) => actuallyCopy(
                globResult,
                globs[globIndex],
              )),
            );
            return Object.fromEntries(toReturn2);
          }),
        );
        currentSpinner.succeed(`Successfully copied ${app.name}! ${moveIndex !== (app.move as Move[]).length - 1 ? 'Moving on...' : 'All apps copied!'}`);
        if (moveIndex !== (app.move as Move[]).length - 1) currentSpinner = ora({ text: '', spinner: 'bouncingBall' }).start();
        return results;
      }),
    );
    console.log(toReturn);
    return [app.id, toReturn];
  })));
  return appTransferData;
};

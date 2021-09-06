import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { App } from './types.js';

const pathSep = process.platform === 'win32' ? '\\' : '/';
// platformize, transforms path separators to OS specific
const p9eStr = (str: string, sep?: string) => str.replace(/\/|\\/g, sep || pathSep);
const templatize = <
  Fn extends Function,
  // Effect: (string, ...infer U) => infer R
  R = Fn extends (_: string, ...args: unknown[]) => infer U ? U : never, // Captured R!
  P = Fn extends (_: string, ...args: (infer U)[]) => unknown ? U : never, // Captured P!
>(fn: Fn) => (data: TemplateStringsArray | string, ...args: P[]): R => {
    if (typeof data === 'string') return fn(data, ...args);
    return fn(
      data.map((v, i) => `${v}${i in args ? args[i] : ''}`).join(''),
    );
  };
const p9e = templatize(p9eStr);

const fileDirname = dirname(fileURLToPath(import.meta.url));
const getAppMap = (apps: App[]) => new Map(apps.map((v: App) => [v.id, { ...v }]));

export { p9e, fileDirname, getAppMap };

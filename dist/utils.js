import { dirname } from 'path';
import { fileURLToPath } from 'url';
const pathSep = process.platform === 'win32' ? '\\' : '/';
// platformize, transforms path separators to OS specific
const p9eStr = (str, sep) => str.replace(/\/|\\/g, sep || pathSep);
const templatize = (fn) => (data, ...args) => {
    if (typeof data === 'string')
        return fn(data, ...args);
    return fn(data.map((v, i) => `${v}${i in args ? args[i] : ''}`).join(''));
};
const p9e = templatize(p9eStr);
const fileDirname = dirname(fileURLToPath(import.meta.url));
const getAppMap = (apps) => new Map(apps.map((v) => [v.id, Object.assign({}, v)]));
export { p9e, fileDirname, getAppMap };

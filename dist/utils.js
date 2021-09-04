const pathSep = process.platform === 'win32' ? '\\' : '/';
// platformize, transforms path separators to OS specific
const p9eStr = (str, sep) => str.replace(/\/|\\/g, sep || pathSep);
const templatize = (fn) => (data, ...args) => {
    if (typeof data === 'string')
        return fn(data, ...args);
    return fn(data.map((v, i) => `${v}${i in args ? args[i] : ''}`).join(''));
};
const p9e = templatize(p9eStr);
export { p9e };

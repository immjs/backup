const pathSep = process.platform === 'win32' ? '\\' : '/';
// platformize, transforms path separators to OS specific
const p9eStr = (str) => str.replace(/\//g, pathSep);
const templatize = (fn) => (templData, ...vals) => {
    if (typeof templData === 'string')
        return fn(templData);
    return fn(templData.map((v, i) => `${v}${i in vals ? vals[i] : ''}`).join(''));
};
const p9e = templatize(p9eStr);
export { p9e };

import { App } from './types.js';
declare const p9e: (data: TemplateStringsArray | string, ...args: (string | undefined)[]) => never;
declare const fileDirname: string;
declare const getAppMap: (apps: App[]) => Map<string, {
    id: string;
    name: string;
    dependencies?: import("./types.js").MaybeArray<string> | undefined;
    install: import("./types.js").MaybeArray<import("./types.js").Install>;
    postinstall?: string | undefined;
    move?: import("./types.js").Move[] | undefined;
}>;
declare const mapAsync: <T, Fn extends (v: T, i: number, a: T[]) => Promise<unknown>, U = Fn extends (v: T, i: number, a: T[]) => Promise<(infer V)[]> ? V : never>(arr: T[], callback: Fn) => Promise<U[]>;
export { p9e, fileDirname, getAppMap, mapAsync, };

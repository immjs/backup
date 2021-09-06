import { App } from './types.js';
declare const p9e: (data: TemplateStringsArray | string, ...args: (string | undefined)[]) => never;
declare const fileDirname: string;
declare const getAppMap: (apps: App[]) => Map<string, {
    id: string;
    name: string;
    dependencies?: string | string[] | undefined;
    install: import("./types.js").Install | import("./types.js").Install[];
    postinstall?: string | undefined;
    move?: import("./types.js").Move[] | undefined;
}>;
export { p9e, fileDirname, getAppMap };

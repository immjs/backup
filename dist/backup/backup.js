import execa from 'execa';
import fse from 'fs-extra';
import { dirname, basename, join } from 'path';
import glob from 'glob';
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
const fileDirname = dirname(fileURLToPath(import.meta.url));
const parseData = async () => {
    const fileContents = await fse.readFile(join(fileDirname, '../../data.yml'), 'utf8');
    const object = assertType(yaml.parse(fileContents, { prettyErrors: true }), object => { var path = ["$"]; function _string(object) { ; if (typeof object !== "string")
        return { message: "validation failed at " + path.join(".") + ": expected a string", path: path.slice(), reason: { type: "string" } };
    else
        return null; } function sa__string_ea_11(object) { ; if (!Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an array", path: path.slice(), reason: { type: "array" } }; for (let i = 0; i < object.length; i++) {
        path.push("[" + i + "]");
        var error = _string(object[i]);
        path.pop();
        if (error)
            return error;
    } return null; } function _null(object) { ; if (object !== null)
        return { message: "validation failed at " + path.join(".") + ": expected null", path: path.slice(), reason: { type: "null" } };
    else
        return null; } function su__string_sa__string_ea_11_11_11_eu(object) { var conditions = [_string, sa__string_ea_11]; for (const condition of conditions) {
        var error = condition(object);
        if (!error)
            return null;
    } return { message: "validation failed at " + path.join(".") + ": there are no valid alternatives", path: path.slice(), reason: { type: "union" } }; } function _451(object) { ; if (object !== "packagemanager")
        return { message: "validation failed at " + path.join(".") + ": expected string 'packagemanager'", path: path.slice(), reason: { type: "string-literal", value: "packagemanager" } };
    else
        return null; } function _undefined(object) { ; if (object !== undefined)
        return { message: "validation failed at " + path.join(".") + ": expected undefined", path: path.slice(), reason: { type: "undefined" } };
    else
        return null; } function su__undefined__string_eu(object) { var conditions = [_undefined, _string]; for (const condition of conditions) {
        var error = condition(object);
        if (!error)
            return null;
    } return { message: "validation failed at " + path.join(".") + ": there are no valid alternatives", path: path.slice(), reason: { type: "union" } }; } function _476(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("apt" in object) {
            path.push("apt");
            var error = su__undefined__string_eu(object["apt"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("rpm" in object) {
            path.push("rpm");
            var error = su__undefined__string_eu(object["rpm"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("dnf" in object) {
            path.push("dnf");
            var error = su__undefined__string_eu(object["dnf"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("yay" in object) {
            path.push("yay");
            var error = su__undefined__string_eu(object["yay"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("pacman" in object) {
            path.push("pacman");
            var error = su__undefined__string_eu(object["pacman"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("all" in object) {
            path.push("all");
            var error = su__undefined__string_eu(object["all"]);
            path.pop();
            if (error)
                return error;
        }
    } return null; } function _443(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("type" in object) {
            path.push("type");
            var error = _451(object["type"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
    } {
        if ("value" in object) {
            path.push("value");
            var error = _476(object["value"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'value' in object", path: path.slice(), reason: { type: "missing-property", property: "value" } };
    } return null; } function _480(object) { ; if (object !== "snap")
        return { message: "validation failed at " + path.join(".") + ": expected string 'snap'", path: path.slice(), reason: { type: "string-literal", value: "snap" } };
    else
        return null; } function _boolean(object) { ; if (typeof object !== "boolean")
        return { message: "validation failed at " + path.join(".") + ": expected a boolean", path: path.slice(), reason: { type: "boolean" } };
    else
        return null; } function _482(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("name" in object) {
            path.push("name");
            var error = _string(object["name"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'name' in object", path: path.slice(), reason: { type: "missing-property", property: "name" } };
    } {
        if ("classic" in object) {
            path.push("classic");
            var error = _boolean(object["classic"]);
            path.pop();
            if (error)
                return error;
        }
    } return null; } function _444(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("type" in object) {
            path.push("type");
            var error = _480(object["type"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
    } {
        if ("value" in object) {
            path.push("value");
            var error = _482(object["value"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'value' in object", path: path.slice(), reason: { type: "missing-property", property: "value" } };
    } return null; } function _483(object) { ; if (object !== "shell")
        return { message: "validation failed at " + path.join(".") + ": expected string 'shell'", path: path.slice(), reason: { type: "string-literal", value: "shell" } };
    else
        return null; } function _485(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("gitURI" in object) {
            path.push("gitURI");
            var error = _string(object["gitURI"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("tar" in object) {
            path.push("tar");
            var error = _string(object["tar"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("commands" in object) {
            path.push("commands");
            var error = _string(object["commands"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'commands' in object", path: path.slice(), reason: { type: "missing-property", property: "commands" } };
    } {
        if ("nonRoot" in object) {
            path.push("nonRoot");
            var error = _boolean(object["nonRoot"]);
            path.pop();
            if (error)
                return error;
        }
    } return null; } function _486(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("url" in object) {
            path.push("url");
            var error = _string(object["url"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'url' in object", path: path.slice(), reason: { type: "missing-property", property: "url" } };
    } {
        if ("nonRoot" in object) {
            path.push("nonRoot");
            var error = _boolean(object["nonRoot"]);
            path.pop();
            if (error)
                return error;
        }
    } return null; } function su__485__486_eu(object) { var conditions = [_485, _486]; for (const condition of conditions) {
        var error = condition(object);
        if (!error)
            return null;
    } return { message: "validation failed at " + path.join(".") + ": there are no valid alternatives", path: path.slice(), reason: { type: "union" } }; } function _445(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("type" in object) {
            path.push("type");
            var error = _483(object["type"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'type' in object", path: path.slice(), reason: { type: "missing-property", property: "type" } };
    } {
        if ("value" in object) {
            path.push("value");
            var error = su__485__486_eu(object["value"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'value' in object", path: path.slice(), reason: { type: "missing-property", property: "value" } };
    } return null; } function su__443__444__445_eu(object) { var conditions = [_443, _444, _445]; for (const condition of conditions) {
        var error = condition(object);
        if (!error)
            return null;
    } return { message: "validation failed at " + path.join(".") + ": there are no valid alternatives", path: path.slice(), reason: { type: "union" } }; } function sa_su__443__444__445_eu_ea_446(object) { ; if (!Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an array", path: path.slice(), reason: { type: "array" } }; for (let i = 0; i < object.length; i++) {
        path.push("[" + i + "]");
        var error = su__443__444__445_eu(object[i]);
        path.pop();
        if (error)
            return error;
    } return null; } function su__443__444__445_sa_su__443__444__445_eu_ea_446_446_446_eu(object) { var conditions = [_443, _444, _445, sa_su__443__444__445_eu_ea_446]; for (const condition of conditions) {
        var error = condition(object);
        if (!error)
            return null;
    } return { message: "validation failed at " + path.join(".") + ": there are no valid alternatives", path: path.slice(), reason: { type: "union" } }; } function _519(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("aix" in object) {
            path.push("aix");
            var error = su__undefined__string_eu(object["aix"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("android" in object) {
            path.push("android");
            var error = su__undefined__string_eu(object["android"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("darwin" in object) {
            path.push("darwin");
            var error = su__undefined__string_eu(object["darwin"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("freebsd" in object) {
            path.push("freebsd");
            var error = su__undefined__string_eu(object["freebsd"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("haiku" in object) {
            path.push("haiku");
            var error = su__undefined__string_eu(object["haiku"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("linux" in object) {
            path.push("linux");
            var error = su__undefined__string_eu(object["linux"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("openbsd" in object) {
            path.push("openbsd");
            var error = su__undefined__string_eu(object["openbsd"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("sunos" in object) {
            path.push("sunos");
            var error = su__undefined__string_eu(object["sunos"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("win32" in object) {
            path.push("win32");
            var error = su__undefined__string_eu(object["win32"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("cygwin" in object) {
            path.push("cygwin");
            var error = su__undefined__string_eu(object["cygwin"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("netbsd" in object) {
            path.push("netbsd");
            var error = su__undefined__string_eu(object["netbsd"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("all" in object) {
            path.push("all");
            var error = su__undefined__string_eu(object["all"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("unix" in object) {
            path.push("unix");
            var error = su__undefined__string_eu(object["unix"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("unix-like" in object) {
            path.push("unix-like");
            var error = su__undefined__string_eu(object["unix-like"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("gnu/linux" in object) {
            path.push("gnu/linux");
            var error = su__undefined__string_eu(object["gnu/linux"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("mac" in object) {
            path.push("mac");
            var error = su__undefined__string_eu(object["mac"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("macos" in object) {
            path.push("macos");
            var error = su__undefined__string_eu(object["macos"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("bsd" in object) {
            path.push("bsd");
            var error = su__undefined__string_eu(object["bsd"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("beos" in object) {
            path.push("beos");
            var error = su__undefined__string_eu(object["beos"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("windows" in object) {
            path.push("windows");
            var error = su__undefined__string_eu(object["windows"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("winnt" in object) {
            path.push("winnt");
            var error = su__undefined__string_eu(object["winnt"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("windowsnt" in object) {
            path.push("windowsnt");
            var error = su__undefined__string_eu(object["windowsnt"]);
            path.pop();
            if (error)
                return error;
        }
    } return null; } function su__string__519_eu(object) { var conditions = [_string, _519]; for (const condition of conditions) {
        var error = condition(object);
        if (!error)
            return null;
    } return { message: "validation failed at " + path.join(".") + ": there are no valid alternatives", path: path.slice(), reason: { type: "union" } }; } function sa_su__string__519_eu_ea_521(object) { ; if (!Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an array", path: path.slice(), reason: { type: "array" } }; for (let i = 0; i < object.length; i++) {
        path.push("[" + i + "]");
        var error = su__string__519_eu(object[i]);
        path.pop();
        if (error)
            return error;
    } return null; } function su__string__519_sa_su__string__519_eu_ea_521_521_521_eu(object) { var conditions = [_string, _519, sa_su__string__519_eu_ea_521]; for (const condition of conditions) {
        var error = condition(object);
        if (!error)
            return null;
    } return { message: "validation failed at " + path.join(".") + ": there are no valid alternatives", path: path.slice(), reason: { type: "union" } }; } function _449(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("glob" in object) {
            path.push("glob");
            var error = su__string__519_sa_su__string__519_eu_ea_521_521_521_eu(object["glob"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'glob' in object", path: path.slice(), reason: { type: "missing-property", property: "glob" } };
    } {
        if ("deleteNew" in object) {
            path.push("deleteNew");
            var error = _boolean(object["deleteNew"]);
            path.pop();
            if (error)
                return error;
        }
    } return null; } function sa__449_ea_449(object) { ; if (!Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an array", path: path.slice(), reason: { type: "array" } }; for (let i = 0; i < object.length; i++) {
        path.push("[" + i + "]");
        var error = _449(object[i]);
        path.pop();
        if (error)
            return error;
    } return null; } function _439(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("id" in object) {
            path.push("id");
            var error = _string(object["id"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'id' in object", path: path.slice(), reason: { type: "missing-property", property: "id" } };
    } {
        if ("name" in object) {
            path.push("name");
            var error = _string(object["name"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'name' in object", path: path.slice(), reason: { type: "missing-property", property: "name" } };
    } {
        if ("dependencies" in object) {
            path.push("dependencies");
            var error = su__string_sa__string_ea_11_11_11_eu(object["dependencies"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("install" in object) {
            path.push("install");
            var error = su__443__444__445_sa_su__443__444__445_eu_ea_446_446_446_eu(object["install"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'install' in object", path: path.slice(), reason: { type: "missing-property", property: "install" } };
    } {
        if ("postinstall" in object) {
            path.push("postinstall");
            var error = _string(object["postinstall"]);
            path.pop();
            if (error)
                return error;
        }
    } {
        if ("move" in object) {
            path.push("move");
            var error = sa__449_ea_449(object["move"]);
            path.pop();
            if (error)
                return error;
        }
    } return null; } function sa__439_ea_439(object) { ; if (!Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an array", path: path.slice(), reason: { type: "array" } }; for (let i = 0; i < object.length; i++) {
        path.push("[" + i + "]");
        var error = _439(object[i]);
        path.pop();
        if (error)
            return error;
    } return null; } function _431(object) { ; if (typeof object !== "object" || object === null || Array.isArray(object))
        return { message: "validation failed at " + path.join(".") + ": expected an object", path: path.slice(), reason: { type: "object" } }; {
        if ("apps" in object) {
            path.push("apps");
            var error = sa__439_ea_439(object["apps"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'apps' in object", path: path.slice(), reason: { type: "missing-property", property: "apps" } };
    } {
        if ("storage" in object) {
            path.push("storage");
            var error = sa__string_ea_11(object["storage"]);
            path.pop();
            if (error)
                return error;
        }
        else
            return { message: "validation failed at " + path.join(".") + ": expected 'storage' in object", path: path.slice(), reason: { type: "missing-property", property: "storage" } };
    } return null; } var error = _431(object); return error; });
    return object;
};
const options = program.opts();
if (options.help) {
    console.log(`${chalk.underline.bold('Usage:')}
npx backup [options]

${chalk.underline.bold('Options:')}
${program.helpInformation().match(/(?<=Options:\n)[^]+$/)[0]}`);
    process.exit();
}
else if (options.version) {
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
}).filter(([, v]) => v); // Check which exist
if (programs.length > 1)
    throw new Error(`Options ${programs.map(([v]) => `-${v}`).join(', ').replace(/, -(.)$/, ' and -$1')} cannot be used together`);
(async () => {
    const currentDate = new Date(Date.now());
    const backupData = await parseData();
    const appMap = new Map(backupData.apps.map((v) => [v.id, Object.assign({}, v)]));
    const possiblePrograms = [...appMap.entries()].filter(([, v]) => 'move' in v).map(([id]) => id);
    if (options.all) {
        options.programs = possiblePrograms;
    }
    else if (options.only) {
        options.programs = options.only === '*'
            ? possiblePrograms
            : possiblePrograms.filter((v) => options.only.split(',').includes(v));
    }
    else if (options.skip) {
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
            indicator(state, choice) {
                return choice.enabled ? '☒' : '☐';
            },
            choices: [...appMap.entries()].map(([id, v]) => ({
                message: ('move' in v) ? v.name : chalk.gray(v.name),
                name: id,
                disabled: !('move' in v),
            })),
            initial: [...appMap.entries()].filter(([, v]) => 'move' in v).map(([id]) => id),
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
            footer: (a) => chalk.gray(join(p9e(fileDirname), p9e `../`, strftime(a.input || defaults.location, currentDate))),
        },
        {
            type: 'input',
            name: 'filename',
            message: 'What should the backup be named? (File ext not included)',
            initial: defaults.filename,
            disabled: options.location,
            symbols,
            footer: (a) => chalk.gray(strftime(a.input || defaults.filename, currentDate)),
            validate: (str) => !str.match(/\/|\\/g),
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
    let prompted;
    try {
        if (options.commandLine) {
            console.log(`${chalk.bold.green('[INFO]')} The file location and file name are both formatted using strftime.
You can get information on how to use it on https://strftime.org/
`);
            prompted = await enquirer.prompt(toPrompt);
        }
        else
            prompted = {};
    }
    catch (err) {
        process.exit();
    }
    delete options.commandLine;
    const settled = {
        programs: options.programs || prompted.programs || possiblePrograms,
        fileLocation: options.location || join(fileDirname, '../../', strftime(p9e(prompted.location || defaults.location), currentDate), strftime(p9e(prompted.filename || defaults.filename), currentDate)),
        compression: options.compression || prompted.compression || defaults.compression,
    };
    settled.location = join(settled.fileLocation, '../');
    settled.filename = basename(settled.fileLocation);
    const tempFolder = join(settled.location, `${settled.filename}.temp`);
    await fse.mkdirp(tempFolder);
    const appsCopySpinner = ora({ text: 'Copying apps...', spinner: 'bouncingBall' }).start();
    await fse.mkdirp(join(tempFolder, 'apps'));
    const sys = process.platform;
    const sysMap = Object.fromEntries(Object.entries({
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
        .map(([k, v]) => [k, [k, ...v, 'all']])); // Add itself and 'all' to the sysMap
    const appTransferData = await Promise.all(settled.programs.map(async (appId) => {
        const app = appMap.get(appId);
        if (app.move == null)
            app.move = [];
        if (!Array.isArray(app.move))
            app.move = [app.move];
        appsCopySpinner.text = `Copying app ${app.name}...`;
        const toReturn = await Promise.all(app.move.map(async (move) => {
            const convertIfPlatformDependant = (v) => {
                if (typeof v === 'string')
                    return [v];
                if (Array.isArray(v))
                    return v.map((v1) => convertIfPlatformDependant(v1)[0]);
                for (let i = 0; i < sysMap[sys].length; i += 1) {
                    if (sysMap[sys][i] in v)
                        return [v[sysMap[sys][i]]];
                }
                return [undefined];
            };
            const globs = convertIfPlatformDependant(move.glob).map((v, i) => {
                console.log(v);
                if (!v)
                    console.warn(`${chalk.yellow.bold('[WARN]')} Glob #${i} of ${app.name}.move does not have an entry for ${sysMap[sys].slice(0, sysMap[sys].length - 2)} or ${sysMap[sys][sysMap[sys].length - 2]}`);
                return v;
            }).filter((v) => v != null);
            const actualGlobs = await Promise.all(globs.map(async (currentGlob) => {
                const globNormal = await execa('echo', [currentGlob], { shell: true }).then(({ stdout }) => {
                    console.log(p9e(stdout.trim(), '/'));
                    return p9e(stdout.trim(), '/');
                });
                console.log({ currentGlob, globNormal });
                return globNormal;
            }));
            const toCopy = await Promise.all(globs.map(async (globPattern) => {
                const toReturn2 = await new Promise((res, rej) => glob(globPattern, (er, files) => {
                    if (er)
                        return rej(er);
                    return res(files);
                }));
                return toReturn2;
            }));
            /* toCopy.forEach(() => {
              await fse.copy();
            }); */
            console.log(actualGlobs, toCopy);
        }));
        return toReturn;
    }));
    console.log(backupData, appMap);
})();

/// <reference types="node" />
declare type PackageManagers = 'apt' | 'rpm' | 'dnf' | 'yay' | 'pacman' | 'all';
interface PackageManagerInstall {
    type: 'packagemanager';
    value: Partial<Record<PackageManagers, string>>;
}
interface SnapInstall {
    type: 'snap';
    value: {
        name: string;
        classic?: boolean;
    };
}
interface ShellInstallRemoteScript {
    url: string;
    nonRoot?: boolean;
}
interface ShellInstallCommands {
    gitURI?: string;
    tar?: string;
    commands: string;
    nonRoot?: boolean;
}
interface ShellInstall {
    type: 'shell';
    value: ShellInstallCommands | ShellInstallRemoteScript;
}
declare type Install = PackageManagerInstall | SnapInstall | ShellInstall;
export declare type Platform = NodeJS.Platform | 'unix' | 'unix-like' | 'linux' | 'gnu/linux' | 'mac' | 'macos' | 'bsd' | 'beos' | 'windows' | 'winnt' | 'windowsnt' | 'all';
export declare type PlatformDependant<T> = Partial<Record<Platform, T>>;
export declare type MaybeArray<T> = T | T[];
export interface Move {
    glob: MaybeArray<string | PlatformDependant<string>>;
    deleteNew?: boolean;
}
export interface App {
    id: string;
    name: string;
    dependencies?: string | string[];
    install: Install | Install[];
    postinstall?: string;
    move?: Move[];
}
export interface Data {
    apps: App[];
    storage: string[];
}
export {};

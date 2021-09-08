export type PackageManagers = 'apt'
| 'rpm'
| 'dnf'
| 'yay'
| 'pacman'
| 'all'
| 'winget';

// The following contain the different type of installs
export interface PackageManagerInstall {
  type: 'packagemanager';
  value: Partial<Record<PackageManagers, string>>;
}

export interface SnapInstall {
  type: 'snap';
  value: {
    name: string;
    classic?: boolean;
  };
}

export interface ShellInstallRemoteScript {
  url: string
  nonRoot?: boolean;
}

export interface ShellInstallCommands {
  gitURI?: string;
  tar?: string;
  commands: string;
  nonRoot?: boolean;
}

export interface ShellInstall {
  type: 'shell';
  value: ShellInstallRemoteScript | ShellInstallCommands;
}

export type Install = PackageManagerInstall
| SnapInstall
| ShellInstall;

export type Platform = NodeJS.Platform
| 'unix'
| 'unix-like'
| 'linux'
| 'gnu/linux'
| 'mac'
| 'macos'
| 'bsd'
| 'beos'
| 'windows'
| 'winnt'
| 'windowsnt'
| 'all';

export type PlatformDependant<T> = Partial<Record<Platform, T>>;

export type MaybeArray<T> = T | T[];

export interface Move {
  glob: string | PlatformDependant<string>;
  exclude?: MaybeArray<string>;
  deleteNew?: boolean | 'prompt';
  overwrite?: boolean | 'prompt';
}

export interface App {
  id: string;
  name: string;
  dependencies?: MaybeArray<string>;
  install: MaybeArray<Install>;
  postinstall?: string;
  move?: Move[];
}

export interface Data {
  apps: App[];
  storage: Move[];
}

export interface Settled {
  programs: string[];
  fileLocation: string;
  location?: string;
  filename?: string;
  compression: 'zip' | 'tgz' | 'none';
}

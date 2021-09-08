The backup utility
===
This modular backup utility will help you backup what's essential to you in a few keystrokes!

## Overall data structure
### to be used in data.yml
---
`data.yml` is expected to host the `Data` interface. Here is a sample, more details about certain types can be found later on.

```yaml
apps: # `App[]`
  - id: firefox # Short, concise name
    name: Mozilla Firefox # Full name, to be displayed on terminal
    install: # `Install | Install[]`, all available installs are noted down below
      type: packagemanager
      value: # `Record<PackageManagers, string>`
        all: firefox
    move: # Move[]
      - glob: # string | PlatformDependant
          unix-like: ~/.mozilla/firefox/*.default-release
          win32: '%UserProfile%/AppData/Roaming/Mozilla/Firefox/Profiles/*.default-release' # You won't be able to use Illegal Characters
        deleteNew: true # Deletes all occurences of glob above before copying the new ones over

storage: 
  - glob: ''

```

## Types
### as defined per types.ts
---


## File Tree
---
Relevant files in the file tree
```yaml
backup/             # The root directory
├─data.yml          # The relevant data for the backup
├─dist              # Compiled JS + D.TS files
└─src               # Source directory
  ├─backup          # Contains files for backup
  │ ├─backup.ts     # The main core of backup
  │ ├─defaults.ts   # Tweak with backup defaults here
  │ └─program.ts    # CLI implementation and options
  ├─types.ts        # Types documented in #types
  └─utils.ts        # Utils for the programs
```

## What's to come
---
- [ ] a (web based?) GUI to make configs
- [ ] use as npm package

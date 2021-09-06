The backup utility
===
This modular backup utility will help you backup what's essential to you in a few keystrokes!

## Overall data structure (to be used in `data.yml`) and types (defined in `types.ts`)
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

# Design System Notes

The structured folders in this package are the active architecture:

- `tokens/`
- `primitives/`
- `composite/`
- `features/`
- `shell/`

Do not add new shared UI to the flat `Pluckr*.tsx` files in this directory
unless the file is a temporary compatibility shim required to keep the build
passing during migration.

Track every shim and legacy file in `LEGACY_MIGRATION.md`.

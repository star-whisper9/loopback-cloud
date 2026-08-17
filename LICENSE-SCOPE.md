# License Scope

This file explains which repository materials are covered by the license
files. It is a scope notice, not an additional license.

## GNU GPL v3.0 or later

The GNU GPL applies to first-party source code maintained as part of this
project, including:

- `app/` (except generated documentation data under `app/docs/.generated/`)
- `scripts/`
- `vite.config.ts`
- `react-router.config.ts`
- `tsconfig.json`
- `.github/workflows/`

This list does not include the root `components/` directory.

## CC BY-SA 4.0

The Creative Commons license applies to project documentation and original
non-code documentation content, including:

- `README.md`
- `docs/`
- Generated documentation data under `app/docs/.generated/`
- Original non-code documentation media under `public/`

## Excluded third-party material

The root `components/` directory contains upstream or adapted UI components,
including material originating from shadcn/ui and Aceternity UI. It is not
relicensed by the project-level GPL or CC BY-SA notices. Each component keeps
the license and attribution requirements of its upstream source.

Third-party dependencies, fonts, icons, images, and other externally sourced
material also retain their original licenses. When a file contains a specific
copyright or license notice, that notice takes precedence for that file.

# adsterra-ad

Framework-ready ad components for Adsterra/Hilltopads with shared core logic and adapters for React, Vue, and Svelte.

## Packages

- `@adsterra-ad/core`: provider configs, srcdoc generation, fallback logic
- `@adsterra-ad/react`: React components
- `@adsterra-ad/vue`: Vue components
- `@adsterra-ad/svelte`: Svelte components

## Monorepo Structure

- `packages/core`
- `packages/react`
- `packages/vue`
- `packages/svelte`

## Quick Start

1. Install dependencies:
   - `npm install`
2. Build all packages:
   - `npm run build`

## Notes

- Replace demo ad keys with your own keys before production usage.
- `SocialBar` stores close state in `sessionStorage`.
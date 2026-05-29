# adsterra-ad

Framework-ready ad components for Adsterra with adapters for React, Vue, and Svelte.

## Install

### Option A: npm package (recommended)

```bash
npm i @adsterra-ad/react
# or
npm i @adsterra-ad/vue
# or
npm i @adsterra-ad/svelte
```

### Option B: directly from GitHub

If packages are not published yet, users can install directly from GitHub:

```bash
npm i github:<your-org-or-user>/adsterra-ad#main
```

Note: direct GitHub install is best for testing. For public consumption, publishing each adapter package to npm is better.

## Usage

### React

```tsx
import { AdBanner, AdContainer } from '@adsterra-ad/react';

export default function Page() {
  return (
    <>
      <AdBanner
        format="300x250"
        adLabel="Advertisement"
        showAdLabel={true}
        adLabelPosition="top-center"
      />

      <AdContainer
        format="728x90"
        showAdLabel={false}
      />
    </>
  );
}
```

### Vue 3

```vue
<script setup lang="ts">
import { AdBanner, AdContainer } from '@adsterra-ad/vue';
</script>

<template>
  <AdBanner
    format="300x250"
    ad-label="Advertisement"
    :show-ad-label="true"
    ad-label-position="top-center"
  />

  <AdContainer
    format="728x90"
    :show-ad-label="false"
  />
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { AdBanner, AdContainer } from '@adsterra-ad/svelte';
</script>

<AdBanner
  format="300x250"
  adLabel="Advertisement"
  showAdLabel={true}
  adLabelPosition="top-center"
/>

<AdContainer
  format="728x90"
  showAdLabel={false}
/>
```

## Props

- `format`: `'300x250' | '160x300' | '728x90' | '320x50' | '160x600' | 'native'`
- `provider?`: `'adsterra'`
- `adLabel?`: `string`
- `showAdLabel?`: `boolean`
- `adLabelPosition?`: `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'`
- `onLoad?`: `() => void`
- `onError?`: `() => void`

## Monorepo Structure

- `packages/core`
- `packages/react`
- `packages/vue`
- `packages/svelte`
- `examples/react-vite`
- `examples/vue-vite`
- `examples/sveltekit`

## Local Development

```bash
npm install
npm run build
npm run dev:react
npm run dev:vue
npm run dev:svelte
```

## Notes

- Replace demo ad keys with your own keys before production usage.
- `SocialBar` stores close state in `sessionStorage`.
<script lang="ts">
  import AdBanner from './AdBanner.svelte';
  import type { AdFormat, AdProvider } from '@adsterra-ad/core';

  export let format: AdFormat;
  export let provider: AdProvider = 'adsterra';
  export let className = '';
  export let adLabel = 'Advertisement';

  let adLoaded = false;
  let adFailed = false;
</script>

{#if !adFailed}
  <div class="{!adLoaded ? 'pointer-events-none absolute h-0 w-0 scale-95 overflow-hidden opacity-0' : ''}">
    <AdBanner {format} {provider} {className} {adLabel} onLoad={() => (adLoaded = true)} onError={() => (adFailed = true)} />
  </div>
{/if}
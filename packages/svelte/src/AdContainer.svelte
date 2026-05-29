<script lang="ts">
  import AdBanner from './AdBanner.svelte';
  import type { AdFormat, AdProvider } from '@adsterra-ad/core';

  export let format: AdFormat;
  export let provider: AdProvider = 'adsterra';
  export let className = '';
  export let adLabel = 'Advertisement';
  export let showAdLabel = true;
  export let adLabelPosition:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right' = 'top-left';

  let adLoaded = false;
  let adFailed = false;
  let visibilityStyle = '';

  $: visibilityStyle = adLoaded
    ? 'opacity:1;transform:scale(1);'
    : 'opacity:0;transform:scale(0.95);pointer-events:none;position:absolute;width:0;height:0;overflow:hidden;';
</script>

{#if !adFailed}
  <div style={visibilityStyle}>
    <AdBanner
      {format}
      {provider}
      {className}
      {adLabel}
      {showAdLabel}
      {adLabelPosition}
      onLoad={() => (adLoaded = true)}
      onError={() => (adFailed = true)}
    />
  </div>
{/if}

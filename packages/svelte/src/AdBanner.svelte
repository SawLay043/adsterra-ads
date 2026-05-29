<script lang="ts">
  import { onMount } from 'svelte';
  import { DEFAULT_AD_CONFIGS, buildSrcDoc, createBannerId, shouldFallback, type AdFormat, type AdProvider, type BannerMessage } from '@adsterra-ad/core';

  export let format: AdFormat;
  export let provider: AdProvider = 'adsterra';
  export let className = '';
  export let adLabel = 'Advertisement';
  export let onLoad: (() => void) | undefined = undefined;
  export let onError: (() => void) | undefined = undefined;

  const bannerId = createBannerId();
  let activeProvider: AdProvider = provider;
  let adLoaded = false;
  let adFailed = false;

  $: if (provider !== activeProvider) activeProvider = provider;
  $: config = DEFAULT_AD_CONFIGS[format];
  $: iframeSrcDoc = buildSrcDoc({ format, provider: activeProvider, config, bannerId });

  let config = DEFAULT_AD_CONFIGS[format];
  let iframeSrcDoc = '';

  const handleMessage = (event: MessageEvent<BannerMessage>) => {
    const data = event.data;
    if (!data || data.bannerId !== bannerId) return;

    if (data.type === 'ad-load-success') {
      adLoaded = true;
      onLoad?.();
      return;
    }

    if (data.type === 'ad-load-error') {
      if (shouldFallback(activeProvider, format, data)) {
        activeProvider = 'hilltopads';
        return;
      }
      adFailed = true;
      onError?.();
    }
  };

  onMount(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  });
</script>

{#if !adFailed}
  <div class="{className} {adLoaded ? 'scale-100 opacity-100' : 'pointer-events-none absolute h-0 w-0 scale-95 overflow-hidden opacity-0'}">
    <span style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;">{adLabel}</span>
    <div
      data-testid="ad-banner"
      style="width:{typeof config.width === 'number' ? `${config.width}px` : config.width};height:{typeof config.height === 'number' ? `${config.height}px` : config.height};overflow:hidden;border-radius:6px;border:1px solid #e5e7eb;background:#f3f4f6;display:flex;align-items:center;justify-content:center;"
    >
      <iframe
        title="Advertisement"
        srcdoc={iframeSrcDoc}
        frameborder="0"
        scrolling="no"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
      ></iframe>
    </div>
  </div>
{/if}
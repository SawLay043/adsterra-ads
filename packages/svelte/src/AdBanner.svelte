<script lang="ts">
  import { onMount } from 'svelte';
  import { buildSrcDoc, createBannerId, resolveAdConfig, type AdFormat, type AdProvider, type BannerMessage } from '@adsterra-ad/core';

  export let format: AdFormat;
  export let provider: AdProvider = 'adsterra';
  export let adKey = '';
  export let className = '';
  export let adLabel = 'Advertisement';
  export let showAdLabel = true;
  export let showFallbackPlaceholder = false;
  export let fallbackPlaceholderText = 'Test advertisement';
  export let adLabelPosition:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right' = 'top-left';
  export let onLoad: (() => void) | undefined = undefined;
  export let onError: (() => void) | undefined = undefined;

  const bannerId = createBannerId();
  let activeProvider: AdProvider = provider;
  let adLoaded = false;
  let adFailed = false;
  let currentLoadKey = `${provider}:${format}:${adKey}`;

  let config = resolveAdConfig(format, adKey || undefined);
  let iframeSrcDoc = '';
  let wrapperStyle = '';
  let topLabel = false;
  let bottomLabel = false;
  let labelSpacing = '';
  let labelAlign = '';
  let visibilityStyle = '';

  $: {
    const nextLoadKey = `${provider}:${format}:${adKey}`;
    if (nextLoadKey !== currentLoadKey) {
      currentLoadKey = nextLoadKey;
      activeProvider = provider;
      adLoaded = false;
      adFailed = false;
    }
  }
  $: config = resolveAdConfig(format, adKey || undefined);
  $: iframeSrcDoc = buildSrcDoc({ format, provider: activeProvider, config, bannerId });

  $: wrapperStyle = `display:inline-flex;flex-direction:column;align-items:${adLabelPosition.endsWith('left') ? 'flex-start' : adLabelPosition.endsWith('right') ? 'flex-end' : 'center'};`;
  $: topLabel = showAdLabel && adLabelPosition.startsWith('top');
  $: bottomLabel = showAdLabel && adLabelPosition.startsWith('bottom');
  $: labelSpacing = topLabel ? 'margin-bottom:4px;' : bottomLabel ? 'margin-top:4px;' : '';
  $: labelAlign = `text-align:${adLabelPosition.endsWith('left') ? 'left' : adLabelPosition.endsWith('right') ? 'right' : 'center'};width:100%;`;
  $: visibilityStyle = adLoaded || (adFailed && showFallbackPlaceholder)
    ? 'opacity:1;transform:scale(1);'
    : 'opacity:0;transform:scale(0.95);pointer-events:none;position:absolute;width:0;height:0;overflow:hidden;';

  const handleMessage = (event: MessageEvent<BannerMessage>) => {
    const data = event.data;
    if (!data || data.bannerId !== bannerId) return;

    if (data.type === 'ad-load-success') {
      adLoaded = true;
      onLoad?.();
      return;
    }

    if (data.type === 'ad-load-error') {
      adFailed = true;
      onError?.();
    }
  };

  onMount(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  });
</script>

{#if !adFailed || showFallbackPlaceholder}
  <div class="{className}" style="{wrapperStyle}{visibilityStyle}">
    {#if topLabel}
      <span style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;{labelSpacing}{labelAlign}">{adLabel}</span>
    {/if}
    <div
      data-testid="ad-banner"
      style="width:{typeof config.width === 'number' ? `${config.width}px` : config.width};height:{typeof config.height === 'number' ? `${config.height}px` : config.height};overflow:hidden;border-radius:6px;border:1px solid #e5e7eb;background:#f3f4f6;display:flex;align-items:center;justify-content:center;"
    >
      {#if adFailed && showFallbackPlaceholder}
        <div
          role="img"
          aria-label="{fallbackPlaceholderText} placeholder"
          style='width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;box-sizing:border-box;padding:12px;color:#475569;background:repeating-linear-gradient(135deg, #f8fafc 0, #f8fafc 10px, #eef2f7 10px, #eef2f7 20px);text-align:center;font-family:system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;'
        >
          <strong style="font-size:13px;line-height:1.2;">{fallbackPlaceholderText}</strong>
          <span style="font-size:11px;line-height:1.2;">{format}</span>
        </div>
      {:else}
        <iframe
          title="Advertisement"
          srcdoc={iframeSrcDoc}
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
          style="display:block;width:100%;height:100%;"
        ></iframe>
      {/if}
    </div>
    {#if bottomLabel}
      <span style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;{labelSpacing}{labelAlign}">{adLabel}</span>
    {/if}
  </div>
{/if}

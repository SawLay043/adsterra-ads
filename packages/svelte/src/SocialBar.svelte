<script lang="ts">
  import { onMount } from 'svelte';
  import AdBanner from './AdBanner.svelte';

  export let delayMs = 5000;
  export let storageKey = 'social-bar-closed';

  let isVisible = false;
  let isClosed = false;

  let desktopAdLoaded = false;
  let desktopAdFailed = false;
  let mobileAd1Loaded = false;
  let mobileAd1Failed = false;
  let mobileAd2Loaded = false;
  let mobileAd2Failed = false;
  let isMobile = false;

  $: adsLoaded = isMobile ? mobileAd1Loaded || mobileAd2Loaded : desktopAdLoaded;
  $: adsFailed = isMobile ? mobileAd1Failed || mobileAd2Failed : desktopAdFailed;

  onMount(() => {
    const checkMobile = () => { isMobile = window.innerWidth < 640; };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (sessionStorage.getItem(storageKey) === 'true') {
      isClosed = true;
      return () => window.removeEventListener('resize', checkMobile);
    }

    const timer = setTimeout(() => {
      if (!isClosed) isVisible = true;
    }, delayMs);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  });

  function close() {
    isVisible = false;
    isClosed = true;
    sessionStorage.setItem(storageKey, 'true');
  }
</script>

{#if isVisible && !isClosed && !adsFailed}
  <div class="fixed right-0 bottom-0 left-0 z-[100] flex justify-center p-4 {!adsLoaded ? 'pointer-events-none h-0 overflow-hidden p-0 opacity-0' : ''}">
    <div style="position:relative;max-width:100%;overflow:hidden;border-radius:12px;border:1px solid #e5e7eb;background:#fff;padding:8px;padding-top:24px;box-shadow:0 20px 30px rgba(0,0,0,0.2);">
      <button onclick={close} aria-label="Close advertisement" style="position:absolute;top:4px;right:4px;cursor:pointer;">x</button>
      <div class="hidden sm:block">
        <AdBanner format="728x90" onLoad={() => (desktopAdLoaded = true)} onError={() => (desktopAdFailed = true)} />
      </div>
      <div class="block space-y-2 sm:hidden">
        <AdBanner format="320x50" onLoad={() => (mobileAd1Loaded = true)} onError={() => (mobileAd1Failed = true)} />
        <AdBanner format="320x50" onLoad={() => (mobileAd2Loaded = true)} onError={() => (mobileAd2Failed = true)} />
      </div>
    </div>
  </div>
{/if}
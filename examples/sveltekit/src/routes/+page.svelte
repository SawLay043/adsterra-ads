<script lang="ts">
  import { AdBanner } from '@adsterra-ad/svelte';

  type AdLabelPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

  type AdFormat = '300x250' | '160x300' | '728x90' | '468x60' | '320x50' | '160x600' | 'native';

  type DemoItem =
    | { title: string; props: { adLabelPosition: AdLabelPosition } }
    | { title: string; props: { showAdLabel: false } };

  const adKey = 'YOUR_ADSTERRA_KEY';

  const formats: AdFormat[] = ['300x250', '160x300', '728x90', '468x60', '320x50', '160x600', 'native'];

  const demoItems: DemoItem[] = [
    { title: 'Top Left', props: { adLabelPosition: 'top-left' } },
    { title: 'Top Center', props: { adLabelPosition: 'top-center' } },
    { title: 'Top Right', props: { adLabelPosition: 'top-right' } },
    { title: 'Bottom Left', props: { adLabelPosition: 'bottom-left' } },
    { title: 'Bottom Center', props: { adLabelPosition: 'bottom-center' } },
    { title: 'Bottom Right', props: { adLabelPosition: 'bottom-right' } },
    { title: 'Hidden Label', props: { showAdLabel: false } }
  ];
</script>

<main class="page">
  <h1>SvelteKit Example</h1>
  <p>Testing label options and all ad formats for @adsterra-ad/svelte.</p>

  <h2>Label Positions</h2>
  <section class="grid">
    {#each demoItems as item}
      <article class="card">
        <h3>{item.title}</h3>
        <AdBanner format="300x250" adKey={adKey} {...item.props} showFallbackPlaceholder={true} />
      </article>
    {/each}
  </section>

  <h2>All Formats</h2>
  <section class="grid">
    {#each formats as format}
      <article class="card">
        <h3>{format}</h3>
        <AdBanner {format} adKey={adKey} adLabelPosition="top-center" />
      </article>
    {/each}
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Segoe UI, Arial, sans-serif;
    background: #f5f7fb;
    color: #111827;
  }

  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    display: grid;
    gap: 16px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 16px;
  }

  .card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    display: grid;
    gap: 10px;
    min-height: 360px;
    align-content: start;
  }

  .card h3 {
    margin: 0;
    font-size: 14px;
  }
</style>
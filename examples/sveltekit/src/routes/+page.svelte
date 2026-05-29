<script lang="ts">
  import { AdBanner } from '@adsterra-ad/svelte';

  const demoItems = [
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
  <p>Testing every label option for @adsterra-ad/svelte.</p>
  <section class="grid">
    {#each demoItems as item}
      <article class="card">
        <h3>{item.title}</h3>
        <AdBanner format="300x250" {...item.props} />
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
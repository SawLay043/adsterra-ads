<script lang="ts">
  import { AdBanner } from '@adsterra-ad/svelte';
</script>

<main class="page">
  <h1>SvelteKit Example</h1>
  <p>Testing @adsterra-ad/svelte package.</p>
  <AdBanner format="300x250" />
  <AdBanner format="728x90" />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Segoe UI, Arial, sans-serif;
    background: #f5f7fb;
    color: #111827;
  }

  .page {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px;
    display: grid;
    gap: 16px;
  }
</style>
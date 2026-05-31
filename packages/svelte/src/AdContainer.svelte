<script lang="ts">
  import AdBanner from './AdBanner.svelte';
  import type { AdFormat } from '@adsterra-ad/core';

  export let format: AdFormat;
</script>

<AdBanner {...$$props} {format} />

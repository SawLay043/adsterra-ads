<script lang="ts">
	import AdBanner from './AdBanner.svelte';

	interface Props {
		format: '300x250' | '160x300' | '728x90' | '320x50' | '160x600' | 'native';
		class?: string;
		[key: string]: unknown;
	}

	let { format, class: className = '', ...restProps }: Props = $props();

	const isTesting =
		typeof window !== 'undefined' &&
		(!!(window as unknown as { __vitest_browser__?: boolean }).__vitest_browser__ ||
			window.navigator.userAgent.includes('Headless'));

	let adFailed = $state(false);
	let adLoaded = $state(isTesting);
</script>

{#if !adFailed}
	<div
		class="transition-all duration-300 {className} {!adLoaded
			? 'pointer-events-none absolute h-0 w-0 scale-95 overflow-hidden opacity-0'
			: ''}"
		{...restProps}
	>
		<AdBanner {format} onLoad={() => (adLoaded = true)} onError={() => (adFailed = true)} />
	</div>
{/if}

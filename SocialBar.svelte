<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import AdBanner from './AdBanner.svelte';

	let isVisible = $state(false);
	let isClosed = $state(false);
	let isMobile = $state(false);

	// Track individual ad states
	let desktopAdLoaded = $state(false);
	let desktopAdFailed = $state(false);
	let mobileAd1Loaded = $state(false);
	let mobileAd1Failed = $state(false);
	let mobileAd2Loaded = $state(false);
	let mobileAd2Failed = $state(false);

	// Derive the active dynamic states
	let adsLoaded = $derived(isMobile ? mobileAd1Loaded || mobileAd2Loaded : desktopAdLoaded);
	let adsFailed = $derived(isMobile ? mobileAd1Failed || mobileAd2Failed : desktopAdFailed);

	onMount(() => {
		// Check screen size dynamically
		const checkMobile = () => {
			isMobile = window.innerWidth < 640; // sm breakpoint is 640px
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);

		// Check if user has already closed it in this session
		if (sessionStorage.getItem('social-bar-closed') === 'true') {
			isClosed = true;
			window.removeEventListener('resize', checkMobile);
			return;
		}

		// Show after 5 seconds delay
		const timer = setTimeout(() => {
			if (!isClosed) {
				isVisible = true;
			}
		}, 5000);

		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', checkMobile);
		};
	});

	function close() {
		isVisible = false;
		isClosed = true;
		sessionStorage.setItem('social-bar-closed', 'true');
	}
</script>

{#if isVisible && !isClosed && !adsFailed}
	<div
		class="fixed right-0 bottom-0 left-0 z-[100] flex justify-center p-4 transition-all duration-300 {!adsLoaded
			? 'pointer-events-none h-0 scale-95 overflow-hidden p-0 opacity-0'
			: 'scale-100 opacity-100'}"
		transition:fly={{ y: 100, duration: 500 }}
	>
		<div
			class="relative max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-2 pt-6 shadow-2xl sm:pt-2 dark:border-gray-700 dark:bg-gray-800"
		>
			<!-- Close Button -->
				<button
					onclick={close}
					class="absolute top-1 right-1 z-20 cursor-pointer rounded-full bg-gray-100 p-1 transition-all hover:bg-gray-200 focus:outline-none active:scale-90 active:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500"
					aria-label="Close advertisement"
				>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 text-gray-600 dark:text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<!-- Content -->
			<div class="flex flex-col items-center">
				<!-- Desktop/Tablet View -->
				<div class="hidden sm:block">
					<AdBanner
						format="728x90"
						onLoad={() => (desktopAdLoaded = true)}
						onError={() => (desktopAdFailed = true)}
					/>
				</div>

				<!-- Mobile View (Stacked) -->
				<div class="block space-y-2 sm:hidden">
					<AdBanner
						format="320x50"
						onLoad={() => (mobileAd1Loaded = true)}
						onError={() => (mobileAd1Failed = true)}
					/>
					<AdBanner
						format="320x50"
						onLoad={() => (mobileAd2Loaded = true)}
						onError={() => (mobileAd2Failed = true)}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}

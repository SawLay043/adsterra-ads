<script lang="ts">
	import { dev } from '$app/environment';
	import { untrack } from 'svelte';

	interface Props {
		format: '300x250' | '160x300' | '728x90' | '320x50' | '160x600' | 'native';
		provider?: 'adsterra' | 'hilltopads';
		class?: string;
		onLoad?: () => void;
		onError?: () => void;
	}

	let { format, provider = 'adsterra', class: className = '', onLoad, onError }: Props = $props();

	let activeProvider = $state(untrack(() => provider));
	let lastPropProvider = $state(untrack(() => provider));

	// Generate a unique banner ID to prevent global message collisions
	const bannerId = Math.random().toString(36).substring(2, 9);

	const isTesting =
		typeof window !== 'undefined' &&
		(!!(window as unknown as { __vitest_browser__?: boolean }).__vitest_browser__ ||
			window.navigator.userAgent.includes('Headless'));
	let adLoaded = $state(isTesting);
	let adFailed = $state(false);

	function getReporterScript() {
		if (isTesting) return '';
		const sOpen = '<' + 'script';
		const sClose = '<' + '/script' + '>';
		return `
      ${sOpen}>
        function report(type, reason) {
          window.parent.postMessage({
            type: type,
            bannerId: '${bannerId}',
            format: '${format}',
            provider: '${activeProvider}',
            reason: reason
          }, '*');
        }

        var observer = new MutationObserver(function(mutations) {
          var body = document.body;
          if (body) {
            var hasAdElement = body.querySelector('iframe') || 
                               body.querySelector('a') || 
                               body.querySelector('img');
            if (hasAdElement) {
              report('ad-load-success');
              observer.disconnect();
              clearTimeout(timeoutId);
            }
          }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });

        var timeoutId = setTimeout(function() {
          report('ad-load-error', 'timeout');
          observer.disconnect();
        }, 3000);

        window.onerror = function(msg, url, line, col, error) {
          const isSecurityError = (msg && msg.indexOf('SecurityError') !== -1) || (error && error.name === 'SecurityError');
          const isSandboxError = (msg && msg.indexOf('sandboxed') !== -1);
          report('ad-load-error', isSecurityError ? 'security-error' : isSandboxError ? 'sandbox-error' : 'generic-error: ' + msg);
          return true;
        };
      ${sClose}
    `;
	}

	$effect(() => {
		if (provider !== lastPropProvider) {
			activeProvider = provider;
			lastPropProvider = provider;
		}
	});

	const AD_CONFIGS: Record<
		Props['format'],
		{ key: string; width: number | string; height: number | string }
	> = {
		'300x250': {
			key: 'a63df507acd2eab9674d17bcafcb2514',
			width: 300,
			height: 250
		},
		'160x300': {
			key: '83f5b4a71b8b75054de5c9410db5ec31',
			width: 160,
			height: 300
		},
		'728x90': {
			key: '608c40ac4f99ec5b1f15de546417ccba',
			width: 728,
			height: 90
		},
		'320x50': {
			key: '8d6509c38d17a8bb29933c4ef9cd4327',
			width: 320,
			height: 50
		},
		'160x600': {
			key: 'b609dd6697e15c82d9600af75401fbcc',
			width: 160,
			height: 600
		},
		native: {
			key: 'a03627a5221f2054c614d3cc3e9ab09c',
			width: '100%',
			height: 'auto'
		}
	};

	const config = $derived(AD_CONFIGS[format]);
	const style = $derived(
		`width: ${typeof config.width === 'number' ? config.width + 'px' : config.width}; height: ${typeof config.height === 'number' ? config.height + 'px' : config.height};`
	);

	let iframeSrcDoc = $derived.by(() => {
		const sOpen = '<' + 'script';
		const sClose = '<' + '/script' + '>';

		if (activeProvider === 'hilltopads' && format === '300x250') {
			return `
        <html>
          <head>
            ${getReporterScript()}
          </head>
          <body style="margin: 0; padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh;">
            ${sOpen}> (function(adcms){ var d = document, s = d.createElement('script'), l = d.scripts[d.scripts.length - 1]; s.settings = adcms || {}; s.src = "//untimely-hello.com/bkX.VfsldRG/l/0/YEWWcc/ueMm-9XujZsUYlTkOPmTsY/4cNGTQUPwhN/DvUattNEj/gZ1INTT/Ap0ROBQZ"; s.async = true; s.referrerPolicy = 'no-referrer-when-downgrade'; l.parentNode.insertBefore(s, l); })({}) ${sClose}
          </body>
        </html>
      `;
		}

		if (format === 'native') {
			return `
        <html>
          <head>
            ${getReporterScript()}
          </head>
          <body style="margin: 0; padding: 0; overflow: hidden;">
            ${sOpen} async="async" data-cfasync="false" src="https://pl28807911.effectivegatecpm.com/${config.key}/invoke.js">${sClose}
            <div id="container-${config.key}"></div>
          </body>
        </html>
      `;
		}

		const fallbackScript =
			activeProvider === 'adsterra' && format === '300x250'
				? `
      ${sOpen}>
        window.handleAdError = function(reason) {
          if (${dev}) console.warn('AdBanner: Triggering fallback to hilltopads. Reason:', reason || 'unknown');
          window.parent.postMessage({ type: 'ad-load-error', bannerId: '${bannerId}', format: '${format}', provider: '${activeProvider}', reason: reason }, '*');
        };
        window.onerror = function(msg, url, line, col, error) {
          // Catch SecurityError and sandbox navigation issues specifically
          const isSecurityError = (msg && msg.indexOf('SecurityError') !== -1) || (error && error.name === 'SecurityError');
          const isSandboxError = (msg && msg.indexOf('sandboxed') !== -1);
          
          if (isSecurityError || isSandboxError) {
            if (${dev}) console.warn('AdBanner: Caught Security/Sandbox error:', msg);
            window.handleAdError('security-or-sandbox-violation');
            return true;
          }

          if (${dev}) console.warn('AdBanner: Internal script error caught:', msg);
          window.handleAdError('generic-script-error');
          return true;
        };
        window.onunhandledrejection = function(event) {
          if (${dev}) console.warn('AdBanner: Internal promise rejection caught:', event.reason);
          window.handleAdError('unhandled-rejection');
        };
      ${sClose}
    `
				: '';

		const adScript =
			activeProvider === 'adsterra' && format === '300x250'
				? `${sOpen} type="text/javascript" src="https://www.highperformanceformat.com/${config.key}/invoke.js" onerror="handleAdError()">${sClose}`
				: `${sOpen} type="text/javascript" src="https://www.highperformanceformat.com/${config.key}/invoke.js">${sClose}`;

		return `
      <html>
        <head>
          ${getReporterScript()}
        </head>
        <body style="margin: 0; padding: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh;">
          ${fallbackScript}
          ${sOpen} type="text/javascript">
            atOptions = {
              'key' : '${config.key}',
              'format' : 'iframe',
              'height' : ${config.height},
              'width' : ${config.width},
              'params' : {}
            };
          ${sClose}
          ${adScript}
        </body>
      </html>
    `;
	});

	$effect(() => {
		const handleMessage = (event: MessageEvent) => {
			const isMatch =
				event.data?.bannerId === bannerId ||
				(isTesting && !event.data?.bannerId && event.data?.format === format);
			if (!isMatch) return;

			if (event.data?.type === 'ad-load-error') {
				if (activeProvider === 'adsterra' && format === '300x250') {
					const reason = event.data.reason || 'unknown';
					if (dev)
						console.warn(
							`AdBanner: Adsterra 300x250 failed to load (reason: ${reason}), falling back to hilltopads`
						);
					activeProvider = 'hilltopads';
				} else {
					if (dev)
						console.warn(
							`AdBanner: Ad failed to load for format ${format} with provider ${activeProvider}`
						);
					adFailed = true;
					onError?.();
				}
			} else if (event.data?.type === 'ad-load-success') {
				if (dev) console.log(`AdBanner: Ad loaded successfully for format ${format}`);
				adLoaded = true;
				onLoad?.();
			}
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	});

	function handleIframeError() {
		if (activeProvider === 'adsterra' && format === '300x250') {
			if (dev) console.warn('Adsterra 300x250 failed to load, falling back to Hilltopads');
			activeProvider = 'hilltopads';
		}
	}
</script>

{#if !adFailed}
	<div
		class="flex flex-col items-center gap-1 transition-all duration-300 {className} {adLoaded
			? 'scale-100 opacity-100'
			: 'pointer-events-none absolute h-0 w-0 scale-95 overflow-hidden opacity-0'}"
	>
		<span
			class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500"
		>
			Advertisement
		</span>

		<div
			class="ad-container relative flex items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
			{style}
			data-testid="ad-banner"
		>
			<iframe
				title="Advertisement"
				srcdoc={iframeSrcDoc}
				width={typeof config.width === 'number' ? config.width : '100%'}
				height={typeof config.height === 'number' ? config.height : 'auto'}
				frameborder="0"
				scrolling="no"
				class="relative z-10 block"
				sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
				onerror={handleIframeError}
			></iframe>
		</div>
	</div>
{/if}

<style>
	.ad-container :global(iframe) {
		max-width: 100%;
		margin: 0 auto;
	}
</style>

import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import AdBanner from './AdBanner.svelte';

describe('AdBanner Component', () => {
	it('should render a placeholder with the "Advertisement" label', async () => {
		render(AdBanner, { props: { format: '300x250' } });
		const label = page.getByText('Advertisement');
		await expect.element(label).toBeInTheDocument();
	});

	it('should have correct dimensions based on the format', async () => {
		render(AdBanner, { props: { format: '300x250' } });
		const banner = page.getByTestId('ad-banner');
		await expect.element(banner).toHaveStyle({ width: '300px', height: '250px' });
	});

	it('should include an iframe with srcdoc', async () => {
		render(AdBanner, { props: { format: '300x250' } });

		const banner = page.getByTestId('ad-banner');
		const iframe = banner.element().querySelector('iframe');

		expect(iframe).not.toBeNull();
		expect(iframe?.srcdoc).toContain('atOptions');
		expect(iframe?.srcdoc).toContain('invoke.js');
		expect(iframe?.srcdoc).toContain('a63df507acd2eab9674d17bcafcb2514');
	});

	it('should support native format in iframe', async () => {
		render(AdBanner, { props: { format: 'native' } });
		const banner = page.getByTestId('ad-banner');
		const iframe = banner.element().querySelector('iframe');

		expect(iframe?.srcdoc).toContain('effectivegatecpm.com');
		expect(iframe?.srcdoc).toContain('container-a03627a5221f2054c614d3cc3e9ab09c');
	});

	it('should support 160x600 format', async () => {
		render(AdBanner, { props: { format: '160x600' } });
		const banner = page.getByTestId('ad-banner');
		await expect.element(banner).toHaveStyle({ width: '160px', height: '600px' });

		const iframe = banner.element().querySelector('iframe');
		expect(iframe?.srcdoc).toContain('b609dd6697e15c82d9600af75401fbcc');
	});

	it('should support Hilltopads provider for 300x250', async () => {
		render(AdBanner, { props: { format: '300x250', provider: 'hilltopads' } });
		const banner = page.getByTestId('ad-banner');
		const iframe = banner.element().querySelector('iframe');

		expect(iframe?.srcdoc).toContain('untimely-hello.com');
	});

	it('should fallback to Hilltopads if specifically requested or on future failure logic', async () => {
		// Current fallback is manual/prop-driven. Let's test if we can force a fallback.
		// For now, we use the provider prop as the mechanism.
		render(AdBanner, { props: { format: '300x250', provider: 'hilltopads' } });
		const banner = page.getByTestId('ad-banner');
		const iframe = banner.element().querySelector('iframe');

		expect(iframe?.srcdoc).toContain('untimely-hello.com');
		expect(iframe?.srcdoc).not.toContain('highperformanceformat.com');
	});

	it('should fallback to Hilltopads when receiving a postMessage failure signal', async () => {
		render(AdBanner, { props: { format: '300x250', provider: 'adsterra' } });
		const banner = page.getByTestId('ad-banner');
		const iframe = banner.element().querySelector('iframe') as HTMLIFrameElement;

		expect(iframe.srcdoc).toContain('highperformanceformat.com'); // Initial Adsterra

		// Simulate a postMessage from the iframe signaling failure
		// We mock the event that the internal script will eventually send
		window.postMessage({ type: 'ad-load-error', format: '300x250', provider: 'adsterra' }, '*');

		// Wait for Svelte reactivity
		await new Promise((r) => setTimeout(r, 500));

		// The iframe should have re-rendered with Hilltopads
		const updatedIframe = banner.element().querySelector('iframe') as HTMLIFrameElement;
		expect(updatedIframe.srcdoc).toContain('untimely-hello.com');
	});

	it('should fallback when a SecurityError occurs inside the iframe', async () => {
		render(AdBanner, { props: { format: '300x250', provider: 'adsterra' } });
		const banner = page.getByTestId('ad-banner');
		const iframe = banner.element().querySelector('iframe') as HTMLIFrameElement;

		// Initial Adsterra
		expect(iframe.srcdoc).toContain('highperformanceformat.com');

		// We need to wait for the iframe to load enough to have its contentWindow
		await new Promise((r) => setTimeout(r, 1000));

		// Simulate a SecurityError that the user reported
		const iframeWindow = iframe.contentWindow;
		if (iframeWindow) {
			// Create a mock SecurityError
			const securityError = new Error(
				"Failed to set the 'href' property on 'Location': The current window does not have permission to navigate the target frame"
			);
			securityError.name = 'SecurityError';

			// Dispatch error event to trigger window.onerror inside the iframe
			iframeWindow.dispatchEvent(
				new ErrorEvent('error', {
					error: securityError,
					message: securityError.message
				})
			);
		}

		// Wait for Svelte reactivity and message passing
		await new Promise((r) => setTimeout(r, 1000));

		// The iframe should have re-rendered with Hilltopads
		const updatedIframe = banner.element().querySelector('iframe') as HTMLIFrameElement;
		expect(updatedIframe.srcdoc).toContain('untimely-hello.com');
	});
});

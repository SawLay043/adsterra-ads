import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SocialBar from './SocialBar.svelte';
import { tick } from 'svelte';

describe('SocialBar Component', () => {
	beforeEach(() => {
		sessionStorage.clear();
		vi.useFakeTimers();
	});

	it('should show the social bar after 5 seconds', async () => {
		render(SocialBar);

		// Initially not visible
		expect(document.querySelector('button[aria-label="Close advertisement"]')).toBeNull();

		// Fast-forward 5 seconds
		vi.advanceTimersByTime(5000);

		// Wait for Svelte state update
		await tick();

		// Should be visible now
		const closeBtn = document.querySelector('button[aria-label="Close advertisement"]');
		expect(closeBtn).not.toBeNull();
	});

	it('should not show if already closed in session', async () => {
		sessionStorage.setItem('social-bar-closed', 'true');
		render(SocialBar);

		vi.advanceTimersByTime(5000);
		await tick();

		expect(document.querySelector('button[aria-label="Close advertisement"]')).toBeNull();
	});

	it('should close and stay closed when X is clicked', async () => {
		render(SocialBar);
		vi.advanceTimersByTime(5000);
		await tick();

		const closeBtn = document.querySelector('button[aria-label="Close advertisement"]');
		expect(closeBtn).not.toBeNull();

		(closeBtn as HTMLButtonElement).click();

		// Switch to real timers or advance fake timers enough for transitions
		// vi.waitFor is often more reliable for this
		await vi.waitFor(
			() => {
				vi.advanceTimersByTime(100);
				if (document.querySelector('button[aria-label="Close advertisement"]')) {
					throw new Error('Still visible');
				}
			},
			{ timeout: 2000, interval: 50 }
		);

		// Should be hidden
		expect(document.querySelector('button[aria-label="Close advertisement"]')).toBeNull();
		expect(sessionStorage.getItem('social-bar-closed')).toBe('true');
	});
});

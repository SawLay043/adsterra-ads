import type { Component } from 'svelte';
import type { AdFormat, AdProvider } from '@adsterra-ad/core';
export { configureAds } from '@adsterra-ad/core';

export type AdLabelPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface AdBannerProps {
  format: AdFormat;
  provider?: AdProvider;
  adKey?: string;
  className?: string;
  adLabel?: string;
  showAdLabel?: boolean;
  adLabelPosition?: AdLabelPosition;
  showFallbackPlaceholder?: boolean;
  fallbackPlaceholderText?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export type AdContainerProps = AdBannerProps;

export interface SocialBarProps {
  delayMs?: number;
  storageKey?: string;
}

export const AdBanner: Component<AdBannerProps>;
export const AdContainer: Component<AdContainerProps>;
export const SocialBar: Component<SocialBarProps>;

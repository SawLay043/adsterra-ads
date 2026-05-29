import type { Component } from 'svelte';
import type { AdFormat, AdProvider } from '@adsterra-ad/core';

export interface AdBannerProps {
  format: AdFormat;
  provider?: AdProvider;
  className?: string;
  adLabel?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export interface AdContainerProps {
  format: AdFormat;
  provider?: AdProvider;
  className?: string;
  adLabel?: string;
}

export interface SocialBarProps {
  delayMs?: number;
  storageKey?: string;
}

export const AdBanner: Component<AdBannerProps>;
export const AdContainer: Component<AdContainerProps>;
export const SocialBar: Component<SocialBarProps>;
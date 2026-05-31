import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildSrcDoc,
  configureAds,
  createBannerId,
  getBannerStyle,
  resolveAdConfig,
  type AdFormat,
  type AdProvider,
  type BannerMessage
} from '@adsterra-ad/core';

export { configureAds };

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
  className?: string;
  adKey?: string;
  adLabel?: string;
  showAdLabel?: boolean;
  adLabelPosition?: AdLabelPosition;
  showFallbackPlaceholder?: boolean;
  fallbackPlaceholderText?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function AdBanner({
  format,
  provider = 'adsterra',
  className,
  adKey,
  adLabel = 'Advertisement',
  showAdLabel = true,
  adLabelPosition = 'top-left',
  showFallbackPlaceholder = false,
  fallbackPlaceholderText = 'Test advertisement',
  onLoad,
  onError
}: AdBannerProps) {
  const bannerId = useRef(createBannerId());
  const [activeProvider, setActiveProvider] = useState<AdProvider>(provider);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  useEffect(() => {
    setActiveProvider(provider);
    setAdLoaded(false);
    setAdFailed(false);
  }, [provider, format, adKey]);

  const config = resolveAdConfig(format, adKey);
  const srcDoc = useMemo(
    () => buildSrcDoc({ format, provider: activeProvider, config, bannerId: bannerId.current }),
    [format, activeProvider, config]
  );

  useEffect(() => {
    const handler = (event: MessageEvent<BannerMessage>) => {
      const data = event.data;
      if (!data || data.bannerId !== bannerId.current) return;
      if (data.type === 'ad-load-success') {
        setAdLoaded(true);
        onLoad?.();
        return;
      }
      if (data.type === 'ad-load-error') {
        setAdFailed(true);
        onError?.();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onLoad, onError]);

  if (adFailed && !showFallbackPlaceholder) return null;

  const wrapperStyle = getWrapperStyle(adLabelPosition);
  const labelStyle = getLabelStyle(adLabelPosition);
  const visibilityStyle = getVisibilityStyle(adLoaded || (adFailed && showFallbackPlaceholder));
  const bannerStyle = { ...parseStyle(getBannerStyle(config)), overflow: 'hidden', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f3f4f6' };

  return (
    <div className={`${className ?? ''}`.trim()} style={{ ...wrapperStyle, ...visibilityStyle }}>
      {showAdLabel && adLabelPosition.startsWith('top') ? <span style={labelStyle}>{adLabel}</span> : null}
      <div data-testid="ad-banner" style={bannerStyle}>
        {adFailed && showFallbackPlaceholder ? (
          <FallbackPlaceholder format={format} text={fallbackPlaceholderText} />
        ) : (
          <iframe
            title="Advertisement"
            srcDoc={srcDoc}
            width="100%"
            height="100%"
            frameBorder={0}
            scrolling="no"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
            style={{ display: 'block', width: '100%', height: '100%' }}
          />
        )}
      </div>
      {showAdLabel && adLabelPosition.startsWith('bottom') ? <span style={labelStyle}>{adLabel}</span> : null}
    </div>
  );
}

export interface AdContainerProps extends Omit<AdBannerProps, 'onLoad' | 'onError'> {
  containerClassName?: string;
}

export function AdContainer({
  format,
  provider = 'adsterra',
  className,
  adKey,
  adLabel,
  showAdLabel,
  adLabelPosition,
  showFallbackPlaceholder,
  fallbackPlaceholderText,
  containerClassName
}: AdContainerProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  if (adFailed && !showFallbackPlaceholder) return null;

  const visibilityStyle = getVisibilityStyle(adLoaded || (adFailed && !!showFallbackPlaceholder));

  return (
    <div className={`${containerClassName ?? ''}`.trim()} style={visibilityStyle}>
      <AdBanner
        format={format}
        provider={provider}
        className={className}
        adKey={adKey}
        adLabel={adLabel}
        showAdLabel={showAdLabel}
        adLabelPosition={adLabelPosition}
        showFallbackPlaceholder={showFallbackPlaceholder}
        fallbackPlaceholderText={fallbackPlaceholderText}
        onLoad={() => setAdLoaded(true)}
        onError={() => setAdFailed(true)}
      />
    </div>
  );
}

function parseStyle(styleString: string): React.CSSProperties {
  const widthMatch = styleString.match(/width:\s*([^;]+);/);
  const heightMatch = styleString.match(/height:\s*([^;]+);/);
  return {
    width: widthMatch ? widthMatch[1] : undefined,
    height: heightMatch ? heightMatch[1] : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
}

function getWrapperStyle(position: AdLabelPosition): React.CSSProperties {
  return {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: position.endsWith('left') ? 'flex-start' : position.endsWith('right') ? 'flex-end' : 'center'
  };
}

function getLabelStyle(position: AdLabelPosition): React.CSSProperties {
  return {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#9ca3af',
    marginBottom: position.startsWith('top') ? 4 : 0,
    marginTop: position.startsWith('bottom') ? 4 : 0,
    textAlign: position.endsWith('left') ? 'left' : position.endsWith('right') ? 'right' : 'center',
    width: '100%'
  };
}

function getVisibilityStyle(isVisible: boolean): React.CSSProperties {
  if (isVisible) return { opacity: 1, transform: 'scale(1)' };
  return {
    opacity: 0,
    transform: 'scale(0.95)',
    pointerEvents: 'none',
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden'
  };
}

function FallbackPlaceholder({ format, text }: { format: AdFormat; text: string }) {
  return (
    <div
      role="img"
      aria-label={`${text} placeholder`}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        boxSizing: 'border-box',
        padding: 12,
        color: '#475569',
        background: 'repeating-linear-gradient(135deg, #f8fafc 0, #f8fafc 10px, #eef2f7 10px, #eef2f7 20px)',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <strong style={{ fontSize: 13, lineHeight: 1.2 }}>{text}</strong>
      <span style={{ fontSize: 11, lineHeight: 1.2 }}>{format}</span>
    </div>
  );
}

export default AdBanner;

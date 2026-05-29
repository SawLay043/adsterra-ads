import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_AD_CONFIGS,
  buildSrcDoc,
  createBannerId,
  getBannerStyle,
  type AdFormat,
  type AdProvider,
  type BannerMessage
} from '@adsterra-ad/core';

export interface AdBannerProps {
  format: AdFormat;
  provider?: AdProvider;
  className?: string;
  adLabel?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function AdBanner({ format, provider = 'adsterra', className, adLabel = 'Advertisement', onLoad, onError }: AdBannerProps) {
  const bannerId = useRef(createBannerId());
  const [activeProvider, setActiveProvider] = useState<AdProvider>(provider);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  useEffect(() => setActiveProvider(provider), [provider]);

  const config = DEFAULT_AD_CONFIGS[format];
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

  if (adFailed) return null;

  const hiddenClass = adLoaded ? 'scale-100 opacity-100' : 'pointer-events-none absolute h-0 w-0 scale-95 overflow-hidden opacity-0';

  return (
    <div className={`${className ?? ''} ${hiddenClass}`.trim()}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af' }}>
        {adLabel}
      </span>
      <div data-testid="ad-banner" style={{ ...parseStyle(getBannerStyle(config)), overflow: 'hidden', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f3f4f6' }}>
        <iframe
          title="Advertisement"
          srcDoc={srcDoc}
          width={typeof config.width === 'number' ? config.width : undefined}
          height={typeof config.height === 'number' ? config.height : undefined}
          frameBorder={0}
          scrolling="no"
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
        />
      </div>
    </div>
  );
}

export interface AdContainerProps extends Omit<AdBannerProps, 'onLoad' | 'onError'> {
  containerClassName?: string;
}

export function AdContainer({ format, provider = 'adsterra', className, adLabel, containerClassName }: AdContainerProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  if (adFailed) return null;

  const hiddenClass = adLoaded ? '' : 'pointer-events-none absolute h-0 w-0 scale-95 overflow-hidden opacity-0';

  return (
    <div className={`${containerClassName ?? ''} ${hiddenClass}`.trim()}>
      <AdBanner
        format={format}
        provider={provider}
        className={className}
        adLabel={adLabel}
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

export default AdBanner;
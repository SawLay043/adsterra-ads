export type AdFormat = '300x250' | '160x300' | '728x90' | '468x60' | '320x50' | '160x600' | 'native';
export type AdProvider = 'adsterra' | 'hilltopads';

export interface AdConfig {
  key: string;
  width: number | string;
  height: number | string;
}

export interface AdUnitRegistry {
  [format: string]: AdConfig;
}

export type AdKeyRegistry = Partial<Record<AdFormat, string>>;

export interface BannerMessage {
  type: 'ad-load-success' | 'ad-load-error';
  bannerId?: string;
  format?: AdFormat;
  provider?: AdProvider;
  reason?: string;
}

export const DEFAULT_AD_CONFIGS: Record<AdFormat, AdConfig> = {
  '300x250': { key: 'a63df507acd2eab9674d17bcafcb2514', width: 300, height: 250 },
  '160x300': { key: '83f5b4a71b8b75054de5c9410db5ec31', width: 160, height: 300 },
  '728x90': { key: '608c40ac4f99ec5b1f15de546417ccba', width: 728, height: 90 },
  '468x60': { key: 'c85b776db3a5e6ded7f73f9f205dda69', width: 468, height: 60 },
  '320x50': { key: '8d6509c38d17a8bb29933c4ef9cd4327', width: 320, height: 50 },
  '160x600': { key: 'b609dd6697e15c82d9600af75401fbcc', width: 160, height: 600 },
  native: { key: 'a03627a5221f2054c614d3cc3e9ab09c', width: '100%', height: 'auto' }
};

let runtimeAdKeys: AdKeyRegistry = {};

export function configureAds(keys: AdKeyRegistry): void {
  runtimeAdKeys = { ...runtimeAdKeys, ...keys };
}

export function resetAdsConfig(): void {
  runtimeAdKeys = {};
}

export function getConfiguredAdKey(format: AdFormat): string | undefined {
  return runtimeAdKeys[format];
}

export function getBannerStyle(config: AdConfig): string {
  const width = typeof config.width === 'number' ? `${config.width}px` : config.width;
  const height = typeof config.height === 'number' ? `${config.height}px` : config.height;
  return `width: ${width}; height: ${height};`;
}

export function shouldFallback(provider: AdProvider, format: AdFormat, msg: BannerMessage): boolean {
  // Automatic provider fallback is intentionally disabled.
  // Consumers can still choose provider="hilltopads" explicitly.
  return false;
}

function reporterScript({ bannerId, format, provider }: { bannerId: string; format: AdFormat; provider: AdProvider }): string {
  const sOpen = '<' + 'script';
  const sClose = '<' + '/script' + '>';
  return `
${sOpen}>
function report(type, reason) {
  window.parent.postMessage({ type, bannerId: '${bannerId}', format: '${format}', provider: '${provider}', reason }, '*');
}
var observer = new MutationObserver(function() {
  var body = document.body;
  if (body) {
    var hasAdElement = body.querySelector('iframe') || body.querySelector('a') || body.querySelector('img');
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
window.onerror = function(msg) {
  var isSecurityError = msg && msg.indexOf('SecurityError') !== -1;
  var isSandboxError = msg && msg.indexOf('sandboxed') !== -1;
  report('ad-load-error', isSecurityError ? 'security-error' : isSandboxError ? 'sandbox-error' : 'generic-error');
  return true;
};
${sClose}`;
}

export function buildSrcDoc(params: {
  format: AdFormat;
  provider: AdProvider;
  config: AdConfig;
  bannerId: string;
}): string {
  const { format, provider, config, bannerId } = params;
  const sOpen = '<' + 'script';
  const sClose = '<' + '/script' + '>';

  if (provider === 'hilltopads' && format === '300x250') {
    return `
<html><head>${reporterScript({ bannerId, format, provider })}</head>
<body style="margin:0;padding:0;overflow:hidden;display:flex;align-items:center;justify-content:center;height:100vh;">
${sOpen}> (function(adcms){ var d = document, s = d.createElement('script'), l = d.scripts[d.scripts.length - 1]; s.settings = adcms || {}; s.src = "//untimely-hello.com/bkX.VfsldRG/l/0/YEWWcc/ueMm-9XujZsUYlTkOPmTsY/4cNGTQUPwhN/DvUattNEj/gZ1INTT/Ap0ROBQZ"; s.async = true; s.referrerPolicy = 'no-referrer-when-downgrade'; l.parentNode.insertBefore(s, l); })({}) ${sClose}
</body></html>`;
  }

  if (format === 'native') {
    return `
<html><head>${reporterScript({ bannerId, format, provider })}</head>
<body style="margin:0;padding:0;overflow:hidden;">
${sOpen} async="async" data-cfasync="false" src="https://pl28807911.effectivegatecpm.com/${config.key}/invoke.js">${sClose}
<div id="container-${config.key}"></div>
</body></html>`;
  }

  return `
<html><head>${reporterScript({ bannerId, format, provider })}</head>
<body style="margin:0;padding:0;overflow:hidden;display:flex;align-items:center;justify-content:center;height:100vh;">
${sOpen} type="text/javascript">
atOptions = { 'key': '${config.key}', 'format': 'iframe', 'height': ${config.height}, 'width': ${config.width}, 'params': {} };
${sClose}
${sOpen} type="text/javascript" src="https://www.highperformanceformat.com/${config.key}/invoke.js">${sClose}
</body></html>`;
}

export function createBannerId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function withAdKey(config: AdConfig, adKey?: string): AdConfig {
  if (!adKey) return config;
  return { ...config, key: adKey };
}

export function resolveAdConfig(format: AdFormat, adKey?: string): AdConfig {
  const base = DEFAULT_AD_CONFIGS[format];
  const resolvedKey = adKey || getConfiguredAdKey(format);
  return withAdKey(base, resolvedKey);
}

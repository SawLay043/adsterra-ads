import { AdBanner, configureAds } from '@adsterra-ad/react';

configureAds({
  '300x250': 'YOUR_300x250_KEY',
  '160x300': 'YOUR_160x300_KEY',
  '728x90': 'YOUR_728x90_KEY',
  '468x60': 'YOUR_468x60_KEY',
  '320x50': 'YOUR_320x50_KEY',
  '160x600': 'YOUR_160x600_KEY',
  native: 'YOUR_NATIVE_KEY'
});

const formats = [
  '300x250',
  '160x300',
  '728x90',
  '468x60',
  '320x50',
  '160x600',
  'native'
] as const;

const demoItems = [
  { title: 'Top Left', props: { adLabelPosition: 'top-left' as const } },
  { title: 'Top Center', props: { adLabelPosition: 'top-center' as const } },
  { title: 'Top Right', props: { adLabelPosition: 'top-right' as const } },
  { title: 'Bottom Left', props: { adLabelPosition: 'bottom-left' as const } },
  { title: 'Bottom Center', props: { adLabelPosition: 'bottom-center' as const } },
  { title: 'Bottom Right', props: { adLabelPosition: 'bottom-right' as const } },
  { title: 'Hidden Label', props: { showAdLabel: false } }
];

export default function App() {
  return (
    <main className="page">
      <h1>React Example</h1>
      <p>Testing label options and all ad formats for @adsterra-ad/react.</p>

      <h2>Label Positions</h2>
      <section className="grid">
        {demoItems.map((item) => (
          <article key={item.title} className="card">
            <h3>{item.title}</h3>
            <AdBanner format="300x250" {...item.props} showFallbackPlaceholder={true} />
          </article>
        ))}
      </section>

      <h2>All Formats</h2>
      <section className="grid">
        {formats.map((format) => (
          <article key={format} className="card">
            <h3>{format}</h3>
            <AdBanner format={format} adLabelPosition="top-center" showFallbackPlaceholder />
          </article>
        ))}
      </section>
    </main>
  );
}

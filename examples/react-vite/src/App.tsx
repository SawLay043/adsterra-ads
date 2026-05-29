import { AdBanner } from '@adsterra-ad/react';

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
      <p>Testing every label option for @adsterra-ad/react.</p>
      <section className="grid">
        {demoItems.map((item) => (
          <article key={item.title} className="card">
            <h3>{item.title}</h3>
            <AdBanner format="300x250" {...item.props} />
          </article>
        ))}
      </section>
    </main>
  );
}
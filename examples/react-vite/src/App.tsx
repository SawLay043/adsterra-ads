import { AdBanner } from '@adsterra-ad/react';

export default function App() {
  return (
    <main className="page">
      <h1>React Example</h1>
      <p>Testing @adsterra-ad/react package.</p>
      <AdBanner format="300x250" />
      <AdBanner format="728x90" />
    </main>
  );
}
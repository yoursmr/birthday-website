import React, { useEffect, useState } from 'react';
import BirthdayWebsite2025 from './v2025/App2025';

// Very small "router" with no extra libraries.
// The page address decides what she sees:
//   .../birthday-website/            -> this year (2026), the default
//   .../birthday-website/#/2025      -> last year's gift
// The "#" part works on GitHub Pages without any special setup.

const readRoute = () => (window.location.hash === '#/2025' ? '2025' : '2026');

function Placeholder2026() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
        color: '#f5e9c8',
        background: 'radial-gradient(ellipse at top, #1b1a4a 0%, #0a0a23 60%, #05050f 100%)',
        fontFamily: "'Playfair Display', serif"
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
      <h1 style={{ fontSize: '32px', margin: 0 }}>Something is written in the stars...</h1>
      <p style={{ opacity: 0.7, marginTop: '12px' }}>(2026 gift is being built. Coming soon.)</p>
      <a
        href="#/2025"
        style={{ marginTop: '40px', color: '#f5e9c8', opacity: 0.8, fontSize: '14px' }}
      >
        Visit last year's gift 🧸
      </a>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(readRoute());

  useEffect(() => {
    const onChange = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route === '2025' ? <BirthdayWebsite2025 /> : <Placeholder2026 />;
}

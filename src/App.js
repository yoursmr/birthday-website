import React, { useEffect, useState } from 'react';
import BirthdayWebsite2025 from './v2025/App2025';
import App2026 from './v2026/App2026';

// Very small "router" with no extra libraries.
// The page address decides what she sees:
//   .../birthday-website/            -> this year (2026), the default
//   .../birthday-website/#/2025      -> last year's gift
// The "#" part works on GitHub Pages without any special setup.

const readRoute = () => (window.location.hash === '#/2025' ? '2025' : '2026');

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

  return route === '2025' ? <BirthdayWebsite2025 /> : <App2026 />;
}

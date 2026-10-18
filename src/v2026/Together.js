import React, { useEffect, useState } from 'react';
import { TOGETHER_SINCE_ISO } from './config';

// A live counter of the time you have been together.
// It appears only if you set TOGETHER_SINCE_ISO in config.js.

const two = (n) => String(n).padStart(2, '0');

export default function Together({ clockRef }) {
  const readNow = () => (clockRef && clockRef.current ? clockRef.current.now() : Date.now());
  const [now, setNow] = useState(readNow);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(clockRef && clockRef.current ? clockRef.current.now() : Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [clockRef]);

  if (!TOGETHER_SINCE_ISO) return null;
  const since = Date.parse(TOGETHER_SINCE_ISO);
  if (!Number.isFinite(since) || now < since) return null;

  const total = Math.floor((now - since) / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return (
    <div className="v26-together">
      <p className="v26-together-lead">Together for</p>
      <p className="v26-together-days">{days.toLocaleString('en-IN')}</p>
      <p className="v26-together-unit">days</p>
      <p className="v26-together-clock">
        {two(hours)} hours {two(minutes)} minutes {two(seconds)} seconds
      </p>
    </div>
  );
}

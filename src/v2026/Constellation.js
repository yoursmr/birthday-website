import React from 'react';

// One star for every year of her life, joined by a thin line.
// The last star (her new age) stays dim until the gift opens, then lights up.

const WIDTH = 800;
const HEIGHT = 280;

export function starPoints(count) {
  const last = Math.max(1, count - 1);
  return Array.from({ length: count }, (_, i) => {
    const t = i / last;
    return {
      x: 36 + t * 728,
      y: 232 - t * 118 + Math.sin(i * 1.35) * 34 + Math.cos(i * 0.62) * 12,
      r: 2.2 + ((i * 7) % 5) * 0.45
    };
  });
}

const fmt = (n) => n.toFixed(1);

export default function Constellation({ count, lit }) {
  const points = starPoints(count);
  const finalStar = points[points.length - 1];
  const earlier = points.slice(0, -1);
  const beforeFinal = points[points.length - 2];
  const linePoints = earlier.map((p) => `${fmt(p.x)},${fmt(p.y)}`).join(' ');

  return (
    <svg
      className={`v26-const${lit ? ' lit' : ''}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={
        lit
          ? `${count} stars. The last one is shining.`
          : `${count} stars. The last one will light up at midnight.`
      }
    >
      <defs>
        <filter id="v26-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <polyline className="v26-const-line" points={linePoints} />

      <line
        className="v26-link-dim"
        x1={fmt(beforeFinal.x)}
        y1={fmt(beforeFinal.y)}
        x2={fmt(finalStar.x)}
        y2={fmt(finalStar.y)}
      />
      <line
        className="v26-link-lit"
        x1={fmt(beforeFinal.x)}
        y1={fmt(beforeFinal.y)}
        x2={fmt(finalStar.x)}
        y2={fmt(finalStar.y)}
      />

      {earlier.map((p, i) => (
        <circle key={i} className="v26-star" cx={fmt(p.x)} cy={fmt(p.y)} r={p.r} />
      ))}

      <g transform={`translate(${fmt(finalStar.x)} ${fmt(finalStar.y)})`}>
        <circle className="v26-wait-glow" r="16" filter="url(#v26-glow)" />
        <circle className="v26-ring" r="11" />
        <circle className="v26-ring-dot" r="2.4" />
        <g className="v26-bloom">
          <circle className="v26-halo" r="30" filter="url(#v26-glow)" />
          <path
            className="v26-sparkle"
            d="M0,-20 C2,-6 6,-2 20,0 C6,2 2,6 0,20 C-2,6 -6,2 -20,0 C-6,-2 -2,-6 0,-20 Z"
          />
          <circle className="v26-core" r="5.2" />
        </g>
      </g>
    </svg>
  );
}

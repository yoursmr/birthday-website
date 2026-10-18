import React, { useEffect, useState } from 'react';
import { BIRTH_ISO, NAME } from './config';

// "Her sky": the moon on the night she was born, her star sign, and how long she has been shining.
// Everything here is worked out from her birth date, so there is nothing to write by hand.

const DAY_MS = 86400000;
const SYNODIC = 29.530588853; // days from one new moon to the next
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // a new moon we measure from

export function moonPhase(ms) {
  const days = (ms - KNOWN_NEW_MOON) / DAY_MS;
  return (((days % SYNODIC) + SYNODIC) % SYNODIC) / SYNODIC; // 0 new, 0.5 full
}

export function moonName(p) {
  if (p < 0.03 || p >= 0.97) return 'New moon';
  if (p < 0.22) return 'Waxing crescent';
  if (p < 0.28) return 'First quarter';
  if (p < 0.47) return 'Waxing gibbous';
  if (p < 0.53) return 'Full moon';
  if (p < 0.72) return 'Waning gibbous';
  if (p < 0.78) return 'Last quarter';
  return 'Waning crescent';
}

const SIGNS = [
  ['Capricorn', 12, 22], ['Aquarius', 1, 20], ['Pisces', 2, 19], ['Aries', 3, 21],
  ['Taurus', 4, 20], ['Gemini', 5, 21], ['Cancer', 6, 22], ['Leo', 7, 23],
  ['Virgo', 8, 23], ['Libra', 9, 23], ['Scorpio', 10, 23], ['Sagittarius', 11, 22]
];
const SIGN_LINES = {
  Libra: 'Libra, the scales: graceful, fair and always looking for beauty.',
  Scorpio: 'Scorpio, the scorpion: deep, loyal and full of mystery.',
  Capricorn: 'Capricorn, the sea goat: steady, wise and quietly determined.',
  Aquarius: 'Aquarius, the water bearer: original, kind and free.',
  Pisces: 'Pisces, the fish: gentle, dreamy and full of heart.',
  Aries: 'Aries, the ram: brave, bright and full of fire.',
  Taurus: 'Taurus, the bull: warm, patient and lovely to hold on to.',
  Gemini: 'Gemini, the twins: curious, playful and always talking.',
  Cancer: 'Cancer, the crab: caring, tender and protective.',
  Leo: 'Leo, the lion: proud, generous and made to shine.',
  Virgo: 'Virgo, the maiden: thoughtful, careful and kind.',
  Sagittarius: 'Sagittarius, the archer: adventurous and hopeful.'
};

export function starSign(month, day) {
  // The signs start on these dates. The latest start on or before her date is her sign.
  // Before 20 January, the year's first sign is still Capricorn from 22 December.
  const key = month * 100 + day;
  let found = 'Capricorn';
  SIGNS.forEach(([name, m, d]) => {
    if (name !== 'Capricorn' && key >= m * 100 + d) found = name;
  });
  if (key >= 1222) found = 'Capricorn';
  return found;
}

function Moon({ phase }) {
  const r = 46;
  const angle = phase * 2 * Math.PI;
  const waxing = phase < 0.5;
  const rx = Math.abs(Math.cos(angle)) * r;
  const gibbous = Math.cos(angle) < 0;
  const lit = `M0,${-r} A${r},${r} 0 0 1 0,${r} A${rx.toFixed(2)},${r} 0 0 ${gibbous ? 1 : 0} 0,${-r} Z`;
  return (
    <svg className="v26-moon" viewBox="-54 -54 108 108" role="img" aria-label="The moon on the night you were born">
      <defs>
        <radialGradient id="v26-moon-lit" cx="40%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="100%" stopColor="#e8e2c8" />
        </radialGradient>
        <filter id="v26-moon-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <circle r={r + 4} className="v26-moon-halo" filter="url(#v26-moon-glow)" />
      <circle r={r} className="v26-moon-dark" />
      <g transform={waxing ? undefined : 'scale(-1 1)'}>
        <path d={lit} fill="url(#v26-moon-lit)" />
      </g>
      <circle r={r} className="v26-moon-rim" />
    </svg>
  );
}

export default function HerSky({ clockRef }) {
  const readNow = () => (clockRef && clockRef.current ? clockRef.current.now() : Date.now());
  const [now, setNow] = useState(readNow);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(readNow()), 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line
  }, [clockRef]);

  const birth = Date.parse(BIRTH_ISO);
  if (!Number.isFinite(birth)) return null;

  const phase = moonPhase(birth);
  // Month and day as written in India time
  const ist = new Date(birth + 5.5 * 3600000);
  const sign = starSign(ist.getUTCMonth() + 1, ist.getUTCDate());
  const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'Asia/Kolkata' }).format(new Date(birth));
  const dateText = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata'
  }).format(new Date(birth));

  const lived = Math.max(0, now - birth);
  const days = Math.floor(lived / DAY_MS);
  const fullMoons = Math.floor(days / SYNODIC);
  const heartbeats = Math.round((lived / 60000) * 75); // an average resting heart beats about 75 times a minute
  const hours = Math.floor(lived / 3600000);

  return (
    <div className="v26-hersky">
      <p className="v26-lead">The sky on the night {NAME} arrived.</p>

      <div className="v26-hersky-moon">
        <Moon phase={phase} />
        <p className="v26-hersky-phase">{moonName(phase)}</p>
        <p className="v26-hersky-date">
          {weekday}, {dateText}
        </p>
        <p className="v26-hersky-note">This is how the moon looked the night you were born.</p>
      </div>

      <p className="v26-hersky-sign">{SIGN_LINES[sign]}</p>

      <div className="v26-hersky-facts">
        <div>
          <span className="v26-fact-num">{days.toLocaleString('en-IN')}</span>
          <span className="v26-fact-label">days of you in the world</span>
        </div>
        <div>
          <span className="v26-fact-num">{fullMoons.toLocaleString('en-IN')}</span>
          <span className="v26-fact-label">full moons you have seen</span>
        </div>
        <div>
          <span className="v26-fact-num">{hours.toLocaleString('en-IN')}</span>
          <span className="v26-fact-label">hours of you, and counting</span>
        </div>
        <div>
          <span className="v26-fact-num">{heartbeats.toLocaleString('en-IN')}</span>
          <span className="v26-fact-label">heartbeats, about</span>
        </div>
      </div>
    </div>
  );
}

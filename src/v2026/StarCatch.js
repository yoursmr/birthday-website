import React, { useEffect, useRef, useState } from 'react';
import { AGE } from './config';
import { playPop } from './audio';

// A small game: stars fall, she taps to catch them. One star for every year of her life.
// When she has caught them all, a message appears. You can write that message in
// secret/content.txt under "== STARS ==". If you do not, the default below is used.

const MAX_ON_SCREEN = 5;
const SPAWN_EVERY_MS = 850;
const DEFAULT_FINALE = [
  'You caught every star.',
  'One for each year you have lived. I am glad for every one of them.'
];

const SPARKLE_PATH = 'M0,-20 C2,-6 6,-2 20,0 C6,2 2,6 0,20 C-2,6 -6,2 -20,0 C-6,-2 -2,-6 0,-20 Z';

export default function StarCatch({ finale }) {
  const [phase, setPhase] = useState('ready'); // ready, playing, won
  const [caught, setCaught] = useState(0);
  const [stars, setStars] = useState([]);
  const caughtRef = useRef(0);
  const onScreenRef = useRef(0);
  const nextId = useRef(0);
  const spawnTimer = useRef(0);
  const lifeTimers = useRef(new Set());

  const stopAll = () => {
    window.clearInterval(spawnTimer.current);
    lifeTimers.current.forEach((timer) => window.clearTimeout(timer));
    lifeTimers.current.clear();
  };

  // eslint-disable-next-line
  useEffect(() => stopAll, []);

  const removeStar = (id) => {
    setStars((list) => {
      const next = list.filter((s) => s.id !== id);
      onScreenRef.current = next.length;
      return next;
    });
  };

  const spawn = () => {
    if (onScreenRef.current >= MAX_ON_SCREEN) return;
    const id = (nextId.current += 1);
    const duration = 3.4 + Math.random() * 1.6;
    const star = { id, left: 8 + Math.random() * 84, top: 12 + Math.random() * 62, duration };
    onScreenRef.current += 1;
    setStars((list) => [...list, star]);
    const timer = window.setTimeout(() => {
      lifeTimers.current.delete(timer);
      removeStar(id);
    }, duration * 1000);
    lifeTimers.current.add(timer);
  };

  const begin = () => {
    stopAll();
    caughtRef.current = 0;
    onScreenRef.current = 0;
    setCaught(0);
    setStars([]);
    setPhase('playing');
    spawnTimer.current = window.setInterval(spawn, SPAWN_EVERY_MS);
  };

  const catchStar = (id, event) => {
    const box = event.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('v26:sparkle', { detail: { x: box.left + box.width / 2, y: box.top + box.height / 2 } })
    );
    removeStar(id);
    playPop(caughtRef.current);
    caughtRef.current += 1;
    setCaught(caughtRef.current);
    if (caughtRef.current >= AGE) {
      stopAll();
      setStars([]);
      onScreenRef.current = 0;
      setPhase('won');
      window.dispatchEvent(new Event('v26:shower'));
    }
  };

  const message = finale && finale.length ? finale : DEFAULT_FINALE;

  return (
    <div className="v26-catch">
      <p className="v26-lead">Stars are falling tonight. Catch one for every year of your life.</p>

      <div className={`v26-board${phase === 'won' ? ' is-won' : ''}`}>
        {stars.map((star) => (
          <button
            key={star.id}
            type="button"
            className="v26-fall"
            aria-label="Catch this star"
            style={{
              left: `${star.left}%`,
              '--dur': `${star.duration}s`,
              '--y': `${star.top}%`
            }}
            onClick={(event) => catchStar(star.id, event)}
          >
            <svg viewBox="-22 -22 44 44" aria-hidden="true">
              <path d={SPARKLE_PATH} />
            </svg>
          </button>
        ))}

        {phase !== 'playing' && (
          <div className="v26-board-over">
            {phase === 'won' &&
              message.map((line, i) => (
                <p className={i === 0 ? 'v26-over-title' : 'v26-over-text'} key={i}>
                  {line}
                </p>
              ))}
            <button type="button" className="v26-open" onClick={begin}>
              {phase === 'won' ? 'Play again' : 'Begin'}
            </button>
          </div>
        )}
      </div>

      <div className="v26-dots" role="img" aria-label={`${caught} of ${AGE} stars caught`}>
        {Array.from({ length: AGE }, (_, i) => (
          <span className={`v26-dot${i < caught ? ' on' : ''}`} key={i} />
        ))}
      </div>
      <p className="v26-count">
        {caught} of {AGE}
      </p>
    </div>
  );
}

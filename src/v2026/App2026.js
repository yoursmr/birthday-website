import React, { useEffect, useRef, useState } from 'react';
import './v2026.css';
import Starfield from './Starfield';
import Constellation from './Constellation';
import Sections from './Sections';
import MusicButton from './MusicButton';
import { armAudio, startMusic } from './audio';
import { parseContent } from './parseContent';
import { decryptText } from '../lib/crypto';
import { syncTime } from '../lib/trustedTime';
import { lockedGate2026 } from './lockedContent';
import {
  AGE, ALLOW_DEVICE_CLOCK_FALLBACK, LATE_ARRIVAL_AFTER_SECONDS, LATE_COUNTDOWN_SECONDS,
  NAME, OPEN_AT_TEXT, getOpenAtMs, isTestMode
} from './config';

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function words(n) {
  if (n < 20) return ONES[n];
  const rest = n % 10;
  return rest ? `${TENS[Math.floor(n / 10)]}-${ONES[rest]}` : TENS[n / 10];
}

export function ordinal(n) {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] || 'th'}`;
}

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const two = (n) => String(n).padStart(2, '0');

// Keeps the time up to date. The time is India time read from the internet.
// If it cannot be read, "offline" becomes true and she can press Try again.
function useClock() {
  const [nowMs, setNowMs] = useState(null);
  const [offline, setOffline] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const clockRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    setOffline(false);

    const start = async () => {
      let clock;
      if (isTestMode()) {
        const base = Date.now();
        const perfAtStart = performance.now();
        clock = { now: () => base + (performance.now() - perfAtStart), source: 'test' };
      } else {
        clock = await syncTime({ allowDeviceFallback: ALLOW_DEVICE_CLOCK_FALLBACK });
      }
      if (cancelled) return;
      if (!clock) {
        setOffline(true);
        return;
      }
      // You can see this line in the browser console (Inspect, then Console).
      // "internet" is what we want. "device" only appears if you allow the fallback.
      console.info('Gift clock source:', clock.source);
      clockRef.current = clock;
      setNowMs(clock.now());
      timer = window.setInterval(() => setNowMs(clock.now()), 250);
    };

    start();
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [attempt]);

  const retry = () => setAttempt((n) => n + 1);
  return { nowMs, clockRef, offline, retry };
}

function Countdown({ nowMs, openAtMs }) {
  const ready = nowMs !== null;
  const total = ready ? Math.max(0, Math.ceil((openAtMs - nowMs) / 1000)) : 0;
  const parts = [
    { label: 'days', value: Math.floor(total / 86400) },
    { label: 'hours', value: Math.floor((total % 86400) / 3600) },
    { label: 'minutes', value: Math.floor((total % 3600) / 60) },
    { label: 'seconds', value: total % 60 }
  ];

  return (
    <div className="v26-countdown" role="timer" aria-live="off">
      {parts.map((part) => (
        <div className="v26-unit" key={part.label}>
          <span className="v26-num">{ready ? two(part.value) : '--'}</span>
          <span className="v26-unit-label">{part.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function App2026() {
  const openAtMs = getOpenAtMs();
  const { nowMs, clockRef, offline, retry } = useClock();
  const [secret, setSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [checking, setChecking] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [content, setContent] = useState(null);
  const [stage, setStage] = useState('sky');
  const shakeTimer = useRef(0);

  const isOpen = nowMs !== null && nowMs >= openAtMs;
  const gateOpened = stage === 'open';

  // Did she arrive after midnight (rather than watching the countdown reach zero)?
  // Then she gets a short 10 second countdown to enjoy the moment first.
  const lateRef = useRef(null);
  if (lateRef.current === null && nowMs !== null) {
    lateRef.current = nowMs - openAtMs > LATE_ARRIVAL_AFTER_SECONDS * 1000;
  }
  const late = lateRef.current === true;
  const [moment, setMoment] = useState({ phase: 'ready', n: LATE_COUNTDOWN_SECONDS });
  const momentTimer = useRef(0);
  const inMoment = late && moment.phase !== 'done';

  const beginMoment = () => {
    armAudio();
    startMusic();
    setMoment({ phase: 'counting', n: LATE_COUNTDOWN_SECONDS });
    window.clearInterval(momentTimer.current);
    momentTimer.current = window.setInterval(() => {
      setMoment((m) => {
        if (m.phase !== 'counting') return m;
        if (m.n <= 1) {
          window.clearInterval(momentTimer.current);
          window.setTimeout(() => window.dispatchEvent(new Event('v26:shower')), 0);
          return { phase: 'done', n: 0 };
        }
        return { phase: 'counting', n: m.n - 1 };
      });
    }, 1000);
  };
  useEffect(() => () => window.clearInterval(momentTimer.current), []);

  // A meteor shower the moment midnight arrives
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen && !wasOpen.current && !late) {
      window.dispatchEvent(new Event('v26:shower'));
      startMusic(); // midnight: the music begins
    }
    wasOpen.current = isOpen;
  }, [isOpen, late]);

  // Browsers only allow sound after a first tap. We prepare the sound on her first touch,
  // so the music can begin by itself at midnight.
  useEffect(() => {
    const arm = () => armAudio();
    const events = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((name) => window.addEventListener(name, arm, { passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, arm));
  }, []);

  // Match the page edges to the sky, so no white shows when the phone bounces.
  useEffect(() => {
    const before = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#070a24';
    return () => {
      document.body.style.backgroundColor = before;
      window.clearTimeout(shakeTimer.current);
    };
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (checking || !secret.trim()) return;
    // Check the time again at the moment of sending, not only on screen.
    const clock = clockRef.current;
    if (!clock || clock.now() < openAtMs) return;

    armAudio();
    startMusic();
    setChecking(true);
    setWrong(false);
    const text = await decryptText(lockedGate2026, secret);
    setChecking(false);

    if (text) {
      setContent(parseContent(text));
      window.dispatchEvent(new Event('v26:shower'));
      setStage('open');
    } else {
      setWrong(true);
      setShaking(true);
      window.clearTimeout(shakeTimer.current);
      shakeTimer.current = window.setTimeout(() => setShaking(false), 500);
    }
  };

  let title = `${NAME}, your ${ordinal(AGE)} star rises at midnight.`;
  let subtitle = `${capitalize(words(AGE - 1))} stars are already shining.`;
  if (gateOpened) {
    title = `Happy birthday, ${NAME}.`;
    subtitle = '';
  } else if (isOpen) {
    title = `Happy birthday, ${NAME}.`;
    subtitle = `Your ${ordinal(AGE)} star is up. Enter the secret word to open your gift.`;
    if (inMoment) {
      subtitle =
        moment.phase === 'ready'
          ? `Your ${ordinal(AGE)} star has been waiting for you.`
          : 'Your star is rising...';
    }
  }

  return (
    <div className="v26-root">
      <Starfield fireworks={isOpen || gateOpened} />

      <main className={`v26-stage${gateOpened ? ' v26-stage-open' : ''}`}>
        <Constellation count={AGE} lit={(isOpen && !inMoment) || gateOpened} />

        <h1 className="v26-title">{title}</h1>
        {subtitle && <p className="v26-sub">{subtitle}</p>}

        {!gateOpened && inMoment && isOpen && (
          <div className="v26-moment">
            {moment.phase === 'ready' ? (
              <button type="button" className="v26-open" onClick={beginMoment}>
                Begin the moment
              </button>
            ) : (
              <p className="v26-moment-number" role="timer" aria-live="off" key={moment.n}>
                {moment.n}
              </p>
            )}
          </div>
        )}

        {!gateOpened && !inMoment && (
          <>
            {!isOpen && <Countdown nowMs={nowMs} openAtMs={openAtMs} />}

            <form className="v26-gate" onSubmit={onSubmit} autoComplete="off">
              <label className="v26-sr" htmlFor="v26-secret">
                Secret word
              </label>
              <div className={`v26-field${shaking ? ' v26-shake' : ''}`}>
                <input
                  id="v26-secret"
                  className="v26-input"
                  type={showSecret ? 'text' : 'password'}
                  value={secret}
                  disabled={!isOpen}
                  placeholder={isOpen ? 'Secret word' : 'The gift opens at midnight'}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                  onChange={(event) => {
                    setSecret(event.target.value);
                    setWrong(false);
                  }}
                />
                <button
                  type="button"
                  className="v26-toggle"
                  disabled={!isOpen}
                  onClick={() => setShowSecret((value) => !value)}
                >
                  {showSecret ? 'Hide' : 'Show'}
                </button>
              </div>

              {isOpen && (
                <>
                  <button
                    type="submit"
                    className="v26-open"
                    disabled={checking || !secret.trim()}
                  >
                    {checking ? 'Opening...' : 'Open my gift'}
                  </button>
                  <p className="v26-error" role="alert">
                    {wrong ? "That word didn't open it. Check it and try again." : ''}
                  </p>
                </>
              )}
              {!isOpen && !offline && <p className="v26-note">Opens at {OPEN_AT_TEXT}.</p>}
              {offline && (
                <div className="v26-offline" role="alert">
                  <p>We could not read the time in India. Check your internet and try again.</p>
                  <button type="button" className="v26-retry" onClick={retry}>
                    Try again
                  </button>
                </div>
              )}
            </form>
          </>
        )}

        {gateOpened && content && (
          <>
            {content.message &&
              content.message
                .split(/\n{2,}/)
                .map((paragraph, i) => (
                  <p className="v26-message" key={i}>
                    {paragraph}
                  </p>
                ))}
            <Sections content={content} clockRef={clockRef} />
          </>
        )}
      </main>

      {isOpen && !inMoment && <MusicButton />}

      <a className="v26-back" href="#/2025">
        Visit last year's gift 🧸
      </a>
    </div>
  );
}

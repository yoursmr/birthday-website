import React, { useEffect, useRef, useState } from 'react';
import { NAME } from './config';

// Two number candles, a "2" and a "2". She lights them, then blows them out.
// On a phone she can blow into the microphone. If the microphone is not allowed
// or not available, she can tap a button instead, so it always works.

const CANDLES = [
  { x: 118, digit: '2' },
  { x: 178, digit: '2' }
];

const FLAME = 'M0,0 C7,-8 7,-20 0,-31 C-7,-20 -7,-8 0,0 Z';

export default function Candles({ onWish }) {
  const [phase, setPhase] = useState('unlit'); // unlit, lit, out
  const [mic, setMic] = useState('idle'); // idle, listening, denied
  const svgRef = useRef(null);
  const stopRef = useRef(null);

  const canListen =
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function';

  const stopListening = () => {
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }
  };

  // eslint-disable-next-line
  useEffect(() => stopListening, []);

  const blowOut = () => {
    stopListening();
    setMic('idle');
    setPhase('out');
    window.dispatchEvent(new Event('v26:shower'));
  };

  const listen = async () => {
    setMic('listening');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audio = new AudioCtx();
      const analyser = audio.createAnalyser();
      analyser.fftSize = 512;
      audio.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);

      let raf = 0;
      let loudSince = 0;
      let stopped = false;
      stopRef.current = () => {
        stopped = true;
        window.cancelAnimationFrame(raf);
        stream.getTracks().forEach((track) => track.stop());
        if (audio.close) audio.close();
      };

      const tick = () => {
        if (stopped) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const level = Math.sqrt(sum / data.length);
        // The flames lean away while she blows
        if (svgRef.current) svgRef.current.style.setProperty('--breath', String(Math.min(1, level * 4)));
        const now = performance.now();
        if (level > 0.1) {
          if (!loudSince) loudSince = now;
          if (now - loudSince > 300) {
            blowOut();
            return;
          }
        } else {
          loudSince = 0;
        }
        raf = window.requestAnimationFrame(tick);
      };
      tick();
    } catch (error) {
      setMic('denied');
    }
  };

  const lead =
    phase === 'unlit'
      ? 'Every birthday starts with a small light.'
      : phase === 'lit'
      ? 'Take a breath. Make your wish. Then blow.'
      : `Make your wish, ${NAME}. It is already on its way.`;

  return (
    <div className="v26-candles">
      <p className="v26-lead">{lead}</p>

      <svg ref={svgRef} className="v26-cake" viewBox="0 0 320 300" role="img" aria-label="A cake with two candles">
        <defs>
          <linearGradient id="v26-wax" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6f1e3" />
            <stop offset="1" stopColor="#cfc7ee" />
          </linearGradient>
          <filter id="v26-candle-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <ellipse cx="160" cy="268" rx="132" ry="12" fill="rgba(236, 238, 255, 0.12)" />
        <rect x="50" y="190" width="220" height="74" rx="14" fill="#1a2062" stroke="rgba(236, 238, 255, 0.35)" />
        <rect x="85" y="135" width="150" height="60" rx="12" fill="#232b78" stroke="rgba(236, 238, 255, 0.35)" />
        <path d="M50 204 q18 16 36 0 t36 0 t36 0 t36 0 t36 0 t36 0" fill="none" stroke="#f3d58a" strokeWidth="3" />
        <path d="M85 149 q15 14 30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#f3d58a" strokeWidth="3" />
        {[78, 112, 160, 208, 242].map((x) => (
          <circle key={x} cx={x} cy={238} r="2.4" fill="#eceeff" opacity="0.7" />
        ))}
        {[118, 160, 202].map((x) => (
          <circle key={x} cx={x} cy={176} r="2" fill="#eceeff" opacity="0.6" />
        ))}

        {CANDLES.map((candle, i) => (
          <g key={i}>
            <rect x={candle.x} y="82" width="24" height="54" rx="5" fill="url(#v26-wax)" />
            <text
              x={candle.x + 12}
              y="119"
              textAnchor="middle"
              fontSize="26"
              fontWeight="500"
              fill="#2a2158"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {candle.digit}
            </text>
            <line x1={candle.x + 12} y1="82" x2={candle.x + 12} y2="73" stroke="#6b5a3c" strokeWidth="2" strokeLinecap="round" />

            {phase === 'lit' && (
              <g transform={`translate(${candle.x + 12} 74)`}>
                <circle className="v26-flame-glow" cy="-16" r="26" fill="#f3d58a" filter="url(#v26-candle-glow)" />
                <g className="v26-flame-lean">
                  <g className="v26-flame" style={{ animationDelay: `${i * 0.35}s` }}>
                    <path d={FLAME} fill="#f3b45a" />
                    <path d={FLAME} fill="#fff1c2" transform="translate(0 -1) scale(0.5 0.62)" />
                  </g>
                </g>
              </g>
            )}

            {phase === 'out' && (
              <path
                className="v26-smoke"
                d={`M${candle.x + 12} 72 c-5 -8 5 -14 0 -22 c-4 -7 4 -12 1 -18`}
                fill="none"
                stroke="#eceeff"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            )}
          </g>
        ))}
      </svg>

      <div className="v26-candle-actions">
        {phase === 'unlit' && (
          <button type="button" className="v26-open" onClick={() => setPhase('lit')}>
            Light the candles
          </button>
        )}

        {phase === 'lit' && (
          <>
            {canListen && mic !== 'denied' && mic !== 'listening' && (
              <button type="button" className="v26-open" onClick={listen}>
                Blow with my breath
              </button>
            )}
            <button type="button" className={canListen && mic === 'idle' ? 'v26-ghost' : 'v26-open'} onClick={blowOut}>
              Tap to blow
            </button>
            {mic === 'listening' && <p className="v26-hint">Listening. Blow gently toward your device.</p>}
            {mic === 'denied' && <p className="v26-hint">The microphone is off, so tap the button instead.</p>}
          </>
        )}

        {phase === 'out' && (
          <button type="button" className="v26-open" onClick={onWish}>
            Send my wish
          </button>
        )}
      </div>
    </div>
  );
}

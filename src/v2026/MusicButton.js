import React, { useEffect, useRef, useState } from 'react';
import { armAudio, audioSupported, isMuted, isPlaying, setMuted, startMusic, subscribe } from './audio';

// The small round button in the corner: music on, or music off.
export default function MusicButton() {
  const [, force] = useState(0);
  const wasPlaying = useRef(null);
  useEffect(() => subscribe(() => force((n) => n + 1)), []);

  if (!audioSupported()) return null;
  const muted = isMuted();
  const playing = isPlaying();

  // The first touch anywhere also starts the music. So we note, just before that happens,
  // whether the music was already playing. Then a first tap on this button never mutes it by surprise.
  const remember = () => {
    wasPlaying.current = isPlaying();
  };

  const onClick = () => {
    const before = wasPlaying.current === null ? playing : wasPlaying.current;
    wasPlaying.current = null;
    armAudio();
    startMusic();
    if (before) setMuted(!muted);
    else if (muted) setMuted(false);
  };

  const label = !playing ? 'Play music' : muted ? 'Unmute music' : 'Mute music';

  return (
    <button
      type="button"
      className={`v26-music${muted ? ' is-muted' : ''}${playing ? '' : ' is-waiting'}`}
      aria-label={label}
      title={label}
      aria-pressed={playing && !muted}
      onPointerDown={remember}
      onKeyDown={remember}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 18V6l10-2v12" />
        <circle cx="6.5" cy="18" r="2.5" />
        <circle cx="16.5" cy="16" r="2.5" />
        {muted && <line className="v26-music-slash" x1="3" y1="3" x2="21" y2="21" />}
      </svg>
    </button>
  );
}

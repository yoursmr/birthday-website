import React, { useState } from 'react';
import Wishes from './Wishes';
import Candles from './Candles';
import StarCatch from './StarCatch';
import Together from './Together';
import HerSky from './HerSky';

// What she sees after the gate opens: her story, and letters to open one by one.

function Story({ entries }) {
  return (
    <ol className="v26-story">
      {entries.map((entry, i) => (
        <li className="v26-story-item" key={i}>
          {entry.date && <p className="v26-story-date">{entry.date}</p>}
          <h3 className="v26-story-title">{entry.title}</h3>
          {entry.paragraphs.map((p, j) => (
            <p className="v26-story-text" key={j}>
              {p}
            </p>
          ))}
        </li>
      ))}
    </ol>
  );
}

function Letters({ letters }) {
  const [openIndex, setOpenIndex] = useState(-1);
  const [opened, setOpened] = useState({});

  return (
    <div className="v26-letters">
      {letters.map((letter, i) => {
        const isOpen = openIndex === i;
        const wasRead = Boolean(opened[i]);
        return (
          <div className={`v26-letter${isOpen ? ' is-open' : ''}`} key={i}>
            <button
              type="button"
              className="v26-letter-head"
              aria-expanded={isOpen}
              aria-controls={`v26-letter-body-${i}`}
              onClick={() => {
                setOpenIndex(isOpen ? -1 : i);
                setOpened((state) => ({ ...state, [i]: true }));
              }}
            >
              <span className="v26-seal" aria-hidden="true">
                {isOpen ? '✦' : wasRead ? '✧' : '✉'}
              </span>
              <span className="v26-letter-title">{letter.title}</span>
              <span className="v26-letter-state">{isOpen ? 'Close' : wasRead ? 'Read' : 'Sealed'}</span>
            </button>
            {isOpen && (
              <div className="v26-letter-body" id={`v26-letter-body-${i}`}>
                {letter.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Sections({ content, clockRef }) {
  const tabs = [];
  if (content.story.length) tabs.push({ id: 'story', label: 'Our story' });
  if (content.letters.length) tabs.push({ id: 'letters', label: 'Open when' });
  tabs.push({ id: 'sky', label: 'Her sky' });
  tabs.push({ id: 'candles', label: 'Candles' });
  tabs.push({ id: 'stars', label: 'Catch stars' });
  tabs.push({ id: 'wish', label: 'Make a wish' });
  const [tab, setTab] = useState(tabs[0].id);

  return (
    <section className="v26-sections">
      {tabs.length > 1 && (
        <div className="v26-tabs" role="tablist" aria-label="Sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`v26-tab${tab === t.id ? ' is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {tab === 'story' && (
        <>
          <Together clockRef={clockRef} />
          <Story entries={content.story} />
        </>
      )}
      {tab === 'letters' && <Letters letters={content.letters} />}
      {tab === 'sky' && <HerSky clockRef={clockRef} />}
      {tab === 'candles' && <Candles onWish={() => setTab('wish')} />}
      {tab === 'stars' && <StarCatch finale={content.stars} />}
      {tab === 'wish' && <Wishes />}
    </section>
  );
}

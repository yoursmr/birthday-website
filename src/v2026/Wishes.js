import React, { useEffect, useRef, useState } from 'react';

// "Make a wish": she writes a wish and a lantern carries it up into the sky.
// The wish is also emailed to you (same free EmailJS setup as last year).

const EMAILJS_SRC = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
const EMAILJS_PUBLIC_KEY = 'na8mybrNB6RfJIsSp';
const EMAILJS_SERVICE = 'service_nbd23lj';
const EMAILJS_TEMPLATE = 'template_eaohagi';

let loading = null;
function loadEmailJs() {
  if (window.emailjs) return Promise.resolve(window.emailjs);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = EMAILJS_SRC;
      script.async = true;
      script.onload = () => resolve(window.emailjs);
      script.onerror = () => {
        loading = null;
        reject(new Error('EmailJS did not load'));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}

const LANTERN_SECONDS = 9;

export default function Wishes() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [lanterns, setLanterns] = useState([]);
  const nextId = useRef(0);
  const timers = useRef([]);

  useEffect(() => {
    loadEmailJs().catch(() => {}); // get ready early, so sending feels instant
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const wish = text.trim();
    if (!wish || sending) return;

    // The lantern goes up first, so it always feels instant.
    const id = (nextId.current += 1);
    const wishNumber = count + 1;
    setLanterns((list) => [...list, { id, left: 18 + Math.random() * 64 }]);
    timers.current.push(
      window.setTimeout(() => setLanterns((list) => list.filter((l) => l.id !== id)), LANTERN_SECONDS * 1000)
    );
    setCount(wishNumber);
    setText('');
    setSending(true);

    try {
      const emailjs = await loadEmailJs();
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          wish,
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          wish_number: wishNumber
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      // She does not need to see this. Open the browser console to check.
      console.info('Wish email was not sent:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="v26-wish">
      <form onSubmit={onSubmit}>
        <label className="v26-wish-label" htmlFor="v26-wish-text">
          Close your eyes. What do you wish for this year?
        </label>
        <textarea
          id="v26-wish-text"
          className="v26-wish-text"
          value={text}
          rows={4}
          maxLength={500}
          placeholder="Write it here"
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit" className="v26-open v26-wish-send" disabled={!text.trim() || sending}>
          Send it to the sky
        </button>
      </form>

      <p className="v26-wish-status" role="status">
        {count === 0 ? '' : count === 1 ? 'Your wish is in the sky.' : `${count} wishes are in the sky.`}
      </p>
      <p className="v26-wish-note">Every wish you send reaches me, and I will keep each one.</p>

      {lanterns.map((lantern) => (
        <div
          key={lantern.id}
          className="v26-lantern"
          style={{ left: `${lantern.left}%`, animationDuration: `${LANTERN_SECONDS}s` }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

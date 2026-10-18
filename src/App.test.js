import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import App from './App';
import { getOpenAtMs } from './v2026/config';
import { parseContent } from './v2026/parseContent';

// Tests for the 2026 gate. The internet clock and the lock are replaced by
// stand-ins we control, so we can test "before midnight" and "after midnight",
// and so the tests keep working after you put in your own secret word.
let mockNow = 0;
let mockOffline = false;
jest.mock('./lib/trustedTime', () => ({
  syncTime: async () => (mockOffline ? null : { now: () => mockNow, source: 'test' })
}));

const mockDemo = [
  'The sky is yours tonight.',
  '',
  '== STORY ==',
  '# 14 February 2023 | The day we met',
  'First memory.',
  '',
  'Second paragraph.',
  '',
  '# 3 June 2023 | Our first trip',
  'Another memory.',
  '',
  '== LETTERS ==',
  '# Open when you miss me',
  'Secret letter text.',
  '',
  '# Open when you need a smile',
  'Smile letter text.',
  '',
  '== STARS ==',
  '',
  'You caught every star.',
  '',
  'Your own words about her twenty-two years.'
].join('\n');

jest.mock('./lib/crypto', () => ({
  decryptText: async (box, password) =>
    String(password).trim().toLowerCase() === 'twinkle' ? mockDemo : null
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
HTMLCanvasElement.prototype.getContext = () => null; // the starry sky is not needed in tests

const DAY = 24 * 60 * 60 * 1000;
let container;
let root;

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openApp() {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root.render(<App />);
    await pause(20);
  });
}

function typeInto(input, value) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

async function submitSecret(value) {
  await act(async () => {
    typeInto(container.querySelector('input'), value);
  });
  await act(async () => {
    container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await pause(50);
  });
}

const click = (el) =>
  act(async () => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

beforeEach(() => {
  window.location.hash = '';
  mockOffline = false;
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

test('before midnight: countdown shows and the password box is locked', async () => {
  mockNow = getOpenAtMs() - 2.5 * DAY;
  await openApp();

  expect(container.querySelector('h1').textContent).toMatch(/22nd star rises at midnight/);
  const numbers = [...container.querySelectorAll('.v26-num')].map((n) => n.textContent);
  expect(numbers.slice(0, 2)).toEqual(['02', '12']);
  expect(container.querySelector('input').disabled).toBe(true);
  expect(container.querySelector('button[type="submit"]')).toBeNull(); // no open button before midnight
  expect(container.textContent).toMatch(/Opens at 12:00 AM IST on 20 October 2026/);
});

test('one second before midnight is still locked', async () => {
  mockNow = getOpenAtMs() - 1000;
  await openApp();
  expect(container.querySelector('input').disabled).toBe(true);
});

test('if the internet time cannot be read, it stays locked and offers Try again', async () => {
  mockOffline = true;
  await openApp();
  expect(container.querySelector('input').disabled).toBe(true);
  expect(container.querySelector('.v26-retry')).not.toBeNull();
  expect(container.textContent).toMatch(/could not read the time in India/);

  // The internet comes back, she presses Try again, and the countdown appears.
  mockOffline = false;
  mockNow = getOpenAtMs() - DAY;
  await click(container.querySelector('.v26-retry'));
  await act(async () => {
    await pause(20);
  });
  expect(container.querySelector('.v26-retry')).toBeNull();
  expect(container.querySelector('.v26-num').textContent).toBe('01');
});

test('at midnight: unlocks, wrong word refused, right word shows story and letters', async () => {
  mockNow = getOpenAtMs();
  await openApp();

  expect(container.querySelector('h1').textContent).toBe('Happy birthday, NK.');
  expect(container.querySelector('input').disabled).toBe(false);

  await submitSecret('not the word');
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/didn't open it/);
  expect(container.textContent).not.toMatch(/The sky is yours tonight/);

  await submitSecret('Twinkle ');
  expect(container.textContent).toMatch(/The sky is yours tonight/);
  expect(container.querySelector('input')).toBeNull();

  // Story is the first tab
  expect(container.textContent).toMatch(/The day we met/);
  expect(container.textContent).toMatch(/Second paragraph/);

  // Letters stay sealed until tapped, one at a time
  const tabs = [...container.querySelectorAll('[role="tab"]')];
  await click(tabs[1]);
  expect(container.textContent).not.toMatch(/Secret letter text/);
  const heads = container.querySelectorAll('.v26-letter-head');
  await click(heads[0]);
  expect(container.textContent).toMatch(/Secret letter text/);
  await click(container.querySelectorAll('.v26-letter-head')[1]);
  expect(container.textContent).toMatch(/Smile letter text/);
  expect(container.textContent).not.toMatch(/Secret letter text/);
});

test('last year gift is still reachable at #/2025', async () => {
  mockNow = getOpenAtMs() - DAY;
  window.location.hash = '#/2025';
  await openApp();
  expect(container.textContent).toMatch(/Teddy has a special surprise/);
});

test('the 2026 page links to last year gift', async () => {
  mockNow = getOpenAtMs() - DAY;
  await openApp();
  expect(container.querySelector('a[href="#/2025"]')).not.toBeNull();
});

test('the content file format is read correctly', () => {
  const parsed = parseContent(mockDemo);
  expect(parsed.message).toBe('The sky is yours tonight.');
  expect(parsed.story).toHaveLength(2);
  expect(parsed.story[0]).toMatchObject({ date: '14 February 2023', title: 'The day we met' });
  expect(parsed.story[0].paragraphs).toEqual(['First memory.', 'Second paragraph.']);
  expect(parsed.letters.map((l) => l.title)).toEqual(['Open when you miss me', 'Open when you need a smile']);
  // Old style gate message with no headings still works
  expect(parseContent('Just a sentence.')).toEqual({ message: 'Just a sentence.', story: [], letters: [], stars: [] });
  expect(parseContent('Hi\n\n== STARS ==\n\nFirst.\n\nSecond.').stars).toEqual(['First.', 'Second.']);
});

test('make a wish: a lantern rises, the wish is emailed, an empty wish does nothing', async () => {
  const send = jest.fn().mockResolvedValue({ status: 200 });
  window.emailjs = { send };
  mockNow = getOpenAtMs();
  await openApp();
  await submitSecret('twinkle');

  const tabs = [...container.querySelectorAll('[role="tab"]')];
  expect(tabs.map((t) => t.textContent)).toEqual(['Our story', 'Open when', 'Her sky', 'Candles', 'Catch stars', 'Make a wish']);
  await click(tabs[5]);

  // Empty wish: the button is disabled and nothing is sent
  const sendButton = container.querySelector('.v26-wish-send');
  expect(sendButton.disabled).toBe(true);

  const area = container.querySelector('textarea');
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    setter.call(area, 'I wish for more trips together');
    area.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => {
    container.querySelector('.v26-wish form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await pause(20);
  });

  expect(container.querySelectorAll('.v26-lantern')).toHaveLength(1);
  expect(container.querySelector('.v26-wish-status').textContent).toBe('Your wish is in the sky.');
  expect(send).toHaveBeenCalledTimes(1);
  expect(send.mock.calls[0][2].wish).toBe('I wish for more trips together');
  expect(container.querySelector('textarea').value).toBe('');
  delete window.emailjs;
});

test('make a wish: if the email fails she still sees her lantern', async () => {
  window.emailjs = { send: jest.fn().mockRejectedValue(new Error('offline')) };
  mockNow = getOpenAtMs();
  await openApp();
  await submitSecret('twinkle');
  await click([...container.querySelectorAll('[role="tab"]')][5]);
  const area = container.querySelector('textarea');
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    setter.call(area, 'a quiet wish');
    area.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => {
    container.querySelector('.v26-wish form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await pause(20);
  });
  expect(container.querySelectorAll('.v26-lantern')).toHaveLength(1);
  delete window.emailjs;
});

const openTab = async (label) => {
  const tab = [...container.querySelectorAll('[role="tab"]')].find((el) => el.textContent === label);
  await click(tab);
};

test('candles: light them, blow them out, then go to the wish', async () => {
  const shower = jest.fn();
  window.addEventListener('v26:shower', shower);
  mockNow = getOpenAtMs();
  await openApp();
  await submitSecret('twinkle');
  shower.mockClear();
  await openTab('Candles');

  expect(container.querySelectorAll('.v26-flame')).toHaveLength(0);
  await click([...container.querySelectorAll('button')].find((b) => b.textContent === 'Light the candles'));
  expect(container.querySelectorAll('.v26-flame')).toHaveLength(2);
  expect(container.textContent).toMatch(/Take a breath/);

  await click([...container.querySelectorAll('button')].find((b) => b.textContent === 'Tap to blow'));
  expect(container.querySelectorAll('.v26-flame')).toHaveLength(0);
  expect(container.querySelectorAll('.v26-smoke')).toHaveLength(2);
  expect(container.textContent).toMatch(/Make your wish, NK/);
  expect(shower).toHaveBeenCalled();

  await click([...container.querySelectorAll('button')].find((b) => b.textContent === 'Send my wish'));
  expect(container.querySelector('textarea')).not.toBeNull();
  window.removeEventListener('v26:shower', shower);
});

test('catch stars: catch all 22 and the message appears', async () => {
  mockNow = getOpenAtMs();
  await openApp();
  await submitSecret('twinkle');
  await openTab('Catch stars');

  jest.useFakeTimers();
  try {
    await click([...container.querySelectorAll('button')].find((b) => b.textContent === 'Begin'));

    // A star that is never caught disappears by itself
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(container.querySelectorAll('.v26-fall').length).toBeGreaterThan(0);

    for (let i = 0; i < 22; i += 1) {
      let star = container.querySelector('.v26-fall');
      let guard = 0;
      while (!star && guard < 10) {
        await act(async () => {
          jest.advanceTimersByTime(900);
        });
        star = container.querySelector('.v26-fall');
        guard += 1;
      }
      expect(star).not.toBeNull();
      await click(star);
    }
    expect(container.querySelector('.v26-count').textContent).toBe('22 of 22');
    expect(container.textContent).toMatch(/caught every star/);
    expect(container.textContent).toMatch(/Your own words about her twenty-two years/);
    expect([...container.querySelectorAll('button')].some((b) => b.textContent === 'Play again')).toBe(true);
  } finally {
    jest.useRealTimers();
  }
});

test('the together counter stays hidden when no date is set', async () => {
  mockNow = getOpenAtMs();
  await openApp();
  await submitSecret('twinkle');
  expect(container.querySelector('.v26-together')).toBeNull();
});

test('her sky: moon on the birth night, star sign and days lived', async () => {
  mockNow = getOpenAtMs();
  await openApp();
  await submitSecret('twinkle');
  await openTab('Her sky');
  expect(container.textContent).toMatch(/Wednesday, 20 October 2004/);
  expect(container.textContent).toMatch(/Libra/);
  expect(container.textContent).toMatch(/First quarter|Waxing/);
  expect(container.querySelector('.v26-moon')).not.toBeNull();
});

test('arriving after midnight: a 10 second moment first, then the secret word box', async () => {
  mockNow = getOpenAtMs() + 3 * 60 * 1000; // she opens the page three minutes after midnight
  await openApp();
  expect(container.querySelector('h1').textContent).toBe('Happy birthday, NK.');
  expect(container.querySelector('input')).toBeNull(); // no secret word box yet
  const begin = [...container.querySelectorAll('button')].find((b) => b.textContent === 'Begin the moment');
  expect(begin).toBeDefined();

  jest.useFakeTimers();
  try {
    await click(begin);
    expect(container.querySelector('.v26-moment-number').textContent).toBe('10');
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    expect(container.querySelector('.v26-moment-number').textContent).toBe('6');
    expect(container.querySelector('input')).toBeNull();
    await act(async () => {
      jest.advanceTimersByTime(6000);
    });
    expect(container.querySelector('.v26-moment-number')).toBeNull();
    expect(container.querySelector('input').disabled).toBe(false);
  } finally {
    jest.useRealTimers();
  }
});

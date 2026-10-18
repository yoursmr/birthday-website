// Gets the real time in India from the internet, so changing the clock or the
// time zone on her phone does not open the gift early.
//
// How it works:
// 1. Ask free public time services what time it is in India (first answer wins).
// 2. Remember that answer and keep counting with performance.now(). That counter
//    ignores any clock changes made on the device during the visit.
// 3. If NO service answers, we return null. The page then asks her to try again.
//    (Using the device clock as a backup is possible, but off by default.)

const TIME_SOURCES = [
  {
    // India time (IST). Checked live and returns the local India time without an offset.
    url: 'https://timeapi.io/api/time/current/zone?timeZone=Asia/Kolkata',
    read: async (response) => {
      const json = await response.json();
      return Date.parse(String(json.dateTime).slice(0, 23) + '+05:30');
    }
  },
  {
    url: 'https://worldtimeapi.org/api/timezone/Asia/Kolkata',
    read: async (response) => Number((await response.json()).unixtime) * 1000
  },
  {
    // Cloudflare's trace page has a "ts=" line with the current time in seconds.
    url: 'https://www.cloudflare.com/cdn-cgi/trace',
    read: async (response) => {
      const match = /ts=(\d+(?:\.\d+)?)/.exec(await response.text());
      return match ? Number(match[1]) * 1000 : NaN;
    }
  }
];

const TIMEOUT_MS = 5000;
const OLDEST_PLAUSIBLE = Date.UTC(2024, 0, 1);

async function askOne(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const startedAt = performance.now();
  try {
    const response = await fetch(source.url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error('Bad response');
    const serverMs = await source.read(response);
    if (!Number.isFinite(serverMs) || serverMs < OLDEST_PLAUSIBLE) throw new Error('Bad time');
    // Assume the answer was made halfway through the round trip.
    const halfTrip = (performance.now() - startedAt) / 2;
    return serverMs + halfTrip;
  } finally {
    clearTimeout(timer);
  }
}

// Resolves with the first source that answers, rejects only if all fail.
function firstAnswer(sources) {
  return new Promise((resolve, reject) => {
    let failed = 0;
    sources.forEach((source) => {
      askOne(source).then(resolve, () => {
        failed += 1;
        if (failed === sources.length) reject(new Error('No time source answered'));
      });
    });
  });
}

function makeClock(startMs, source) {
  const perfAtSync = performance.now();
  return { now: () => startMs + (performance.now() - perfAtSync), source };
}

// Returns { now: () => milliseconds, source } or null when the internet time could not be read.
export async function syncTime({ allowDeviceFallback = false } = {}) {
  try {
    return makeClock(await firstAnswer(TIME_SOURCES), 'internet');
  } catch (e) {
    return allowDeviceFallback ? makeClock(Date.now(), 'device') : null;
  }
}

// The few settings for the 2026 gift. Change values here, nowhere else.

// Her name as shown on the screen.
export const NAME = 'NK';

// The age she turns this year. This is also how many stars are in the sky.
export const AGE = 22;

// Her birth moment. Used for the "Her sky" page (moon on her birth night, days she has lived).
export const BIRTH_ISO = '2004-10-20T00:00:00+05:30';

// When the gift opens: 12:00 AM India time (IST, +05:30) on 20 October 2026.
export const OPEN_AT_ISO = '2026-10-20T00:00:00+05:30';
export const OPEN_AT_TEXT = '12:00 AM IST on 20 October 2026';

// Optional: the day you became a couple. If you fill this in, her story page shows
// a live counter of how long you have been together. Leave it empty to hide it.
// Format: 'YYYY-MM-DDTHH:MM:SS+05:30', for example '2023-02-14T00:00:00+05:30'
export const TOGETHER_SINCE_ISO = '2025-03-16T12:01:00+05:30';

// What if the internet time cannot be read (no internet, services down)?
//   false = stay locked and ask her to try again (strict, the default you asked for)
//   true  = use the clock on her device instead (she could cheat by changing it)
export const ALLOW_DEVICE_CLOCK_FALLBACK = false;

// TEST MODE (only works on your laptop, never on the live website).
// Set this to a number of seconds, for example 15, and run `npm start`.
// The gift will then open that many seconds after you load the page.
// Leave it at 0 for the real countdown. The live website ignores this setting.
export const TEST_SECONDS_UNTIL_OPEN = 0;

// TEST MODE 2 (laptop only): set to true to see what she sees when she arrives AFTER midnight.
// Keep it false for the real website. The live website ignores this setting.
export const TEST_ARRIVE_LATE = false;

// If she opens the page more than this many seconds after midnight, she gets a short
// 10 second countdown to enjoy the moment, instead of landing straight on the secret word box.
// If she is already watching the page at midnight, nothing changes for her.
export const LATE_ARRIVAL_AFTER_SECONDS = 5;
export const LATE_COUNTDOWN_SECONDS = 10;

const startedAt = Date.now();

export function isTestMode() {
  return process.env.NODE_ENV !== 'production' && (TEST_SECONDS_UNTIL_OPEN > 0 || TEST_ARRIVE_LATE);
}

export function getOpenAtMs() {
  if (process.env.NODE_ENV !== 'production') {
    if (TEST_ARRIVE_LATE) return startedAt - 60 * 60 * 1000;
    if (TEST_SECONDS_UNTIL_OPEN > 0) return startedAt + TEST_SECONDS_UNTIL_OPEN * 1000;
  }
  return Date.parse(OPEN_AT_ISO);
}

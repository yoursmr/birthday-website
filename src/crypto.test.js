import { decryptText } from './lib/crypto';
import { lockedLetter2025, lockedPromise2025 } from './v2025/lockedContent';

// Uses the real lock (no stand-ins) to check last year's locked texts still open.
test('2025 letter and promise open with their words and stay shut with wrong ones', async () => {
  expect(await decryptText(lockedLetter2025, 'iloveyou')).toMatch(/My Baby/);
  expect(await decryptText(lockedLetter2025, ' ILoveYou ')).toMatch(/My Baby/);
  expect(await decryptText(lockedLetter2025, 'forever')).toBeNull();
  expect(await decryptText(lockedPromise2025, 'forever')).toMatch(/To always make you happy/);
  expect(await decryptText(lockedPromise2025, 'iloveyou')).toBeNull();
});

import { moonPhase, moonName, starSign } from './v2026/HerSky';

test('moon phase: new moon, full moon, and her birth night', () => {
  expect(moonName(moonPhase(Date.UTC(2000, 0, 6, 18, 14)))).toBe('New moon');
  // Full moon and lunar eclipse on 28 October 2004
  expect(moonName(moonPhase(Date.UTC(2004, 9, 28, 3, 7)))).toBe('Full moon');
  // 20 October 2004, India: about a week after the new moon on 14 October
  const birth = moonPhase(Date.parse('2004-10-20T00:00:00+05:30'));
  expect(birth).toBeGreaterThan(0.15);
  expect(birth).toBeLessThan(0.4);
});

test('star sign', () => {
  expect(starSign(10, 20)).toBe('Libra');
  expect(starSign(10, 23)).toBe('Scorpio');
  expect(starSign(1, 5)).toBe('Capricorn');
  expect(starSign(12, 25)).toBe('Capricorn');
});

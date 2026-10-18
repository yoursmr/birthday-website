import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

// The date is set here, so we can check the counter's numbers.
jest.mock('./v2026/config', () => ({
  ...jest.requireActual('./v2026/config'),
  TOGETHER_SINCE_ISO: '2023-02-14T00:00:00+05:30'
}));

import Together from './v2026/Together';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

test('shows the days and the time together, counted from the clock it is given', async () => {
  // 1,344 days, 5 hours, 6 minutes and 7 seconds after the start date
  const since = Date.parse('2023-02-14T00:00:00+05:30');
  const clockRef = { current: { now: () => since + (1344 * 86400 + 5 * 3600 + 6 * 60 + 7) * 1000 } };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<Together clockRef={clockRef} />);
  });
  expect(container.querySelector('.v26-together-days').textContent).toBe('1,344');
  expect(container.querySelector('.v26-together-clock').textContent).toBe('05 hours 06 minutes 07 seconds');
  act(() => root.unmount());
  container.remove();
});

test('stays hidden if the clock is before the start date', async () => {
  const clockRef = { current: { now: () => Date.parse('2020-01-01T00:00:00+05:30') } };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(<Together clockRef={clockRef} />);
  });
  expect(container.querySelector('.v26-together')).toBeNull();
  act(() => root.unmount());
  container.remove();
});

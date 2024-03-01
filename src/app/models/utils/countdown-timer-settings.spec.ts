import { CountdownTimerSettings } from './countdown-timer-settings';

describe('CountdownTimerSettings', () => {
  it('should create an instance', () => {
    expect(new CountdownTimerSettings(0, 0, 0, 0, '', '', '', 0, 0, '', '')).toBeTruthy();
  });
});

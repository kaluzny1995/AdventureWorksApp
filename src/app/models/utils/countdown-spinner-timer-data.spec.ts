import { CountdownSpinnerTimerData } from './countdown-spinner-timer-data';

describe('CountdownSpinnerTimerData', () => {
  it('should create an instance', () => {
    expect(new CountdownSpinnerTimerData(0, 0, '', [], 0, 0, '', '')).toBeTruthy();
  });
});

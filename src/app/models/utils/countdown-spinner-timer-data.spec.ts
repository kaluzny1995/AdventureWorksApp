import { CountdownSpinnerTimerData } from './countdown-spinner-timer-data';

describe('CountdownSpinnerTimerData', () => {
  it('should create an instance', () => {
    expect(new CountdownSpinnerTimerData(60, 120, 'mm:ss', [], 50, 4, 'Time left', 'Done')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const data = new CountdownSpinnerTimerData(60, 120, 'mm:ss', [10, 20], 50, 4, 'Time left', 'Done');
    expect(data.currentTimeSecs).toBe(60);
    expect(data.totalTimeSecs).toBe(120);
    expect(data.timeFormat).toBe('mm:ss');
    expect(data.notifications).toEqual([10, 20]);
    expect(data.spinnerDiameter).toBe(50);
    expect(data.spinnerStrokeWidth).toBe(4);
    expect(data.titleText).toBe('Time left');
    expect(data.titleTextFinish).toBe('Done');
  });
});

import { CountdownTimerSettings } from './countdown-timer-settings';

describe('CountdownTimerSettings', () => {
  it('should create an instance', () => {
    expect(new CountdownTimerSettings(5, 4, 2, 1, 'mm:ss', 'tooltip', 'finish', 50, 4, 'title', 'done')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const settings = new CountdownTimerSettings(5, 4, 2, 1, 'mm:ss', 'tooltip', 'finish', 50, 4, 'title', 'done');
    expect(settings.timeMins).toBe(5);
    expect(settings.notifyGreenAt).toBe(4);
    expect(settings.notifyYellowAt).toBe(2);
    expect(settings.notifyRedAt).toBe(1);
    expect(settings.timeFormat).toBe('mm:ss');
    expect(settings.tooltipText).toBe('tooltip');
    expect(settings.tooltipFinishText).toBe('finish');
    expect(settings.spinnerDiameter).toBe(50);
    expect(settings.spinnerStrokeWidth).toBe(4);
    expect(settings.titleText).toBe('title');
    expect(settings.titleTextFinish).toBe('done');
  });
});

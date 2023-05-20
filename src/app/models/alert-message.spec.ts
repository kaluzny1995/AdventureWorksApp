import { AlertMessage } from './alert-message';
import { EAlertType } from './e-alert-type';

describe('AlertMessage', () => {
  it('should create an instance', () => {
    expect(new AlertMessage(EAlertType.INFO, 'status', 'Status message.')).toBeTruthy();
  });
});

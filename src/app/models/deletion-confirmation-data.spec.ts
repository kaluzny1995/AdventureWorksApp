import { DeletionConfirmationData } from './deletion-confirmation-data';

describe('DeletionConfirmationData', () => {
  it('should create an instance', () => {
    expect(new DeletionConfirmationData('', '', '')).toBeTruthy();
  });
});

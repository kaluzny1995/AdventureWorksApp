import { DeletionConfirmationData } from './deletion-confirmation-data';

describe('DeletionConfirmationData', () => {
  it('should create an instance', () => {
    expect(new DeletionConfirmationData('title', 'desc', 'error')).toBeTruthy();
  });

  it('should have correct properties', () => {
    const data = new DeletionConfirmationData('Delete Item', 'Are you sure?', 'Failed to delete');
    expect(data.title).toBe('Delete Item');
    expect(data.description).toBe('Are you sure?');
    expect(data.errorMessage).toBe('Failed to delete');
  });
});

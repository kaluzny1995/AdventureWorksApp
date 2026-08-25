import { CustomErrorHandler } from './app.error-handlers';

describe('CustomErrorHandler', () => {
  let handler: CustomErrorHandler;

  beforeEach(() => {
    handler = new CustomErrorHandler();
  });

  it('should create an instance', () => {
    expect(handler).toBeTruthy();
  });

  describe('handleError', () => {
    it('should rethrow string errors', () => {
      expect(() => handler.handleError('string error')).toThrow('string error');
    });

    it('should rethrow number errors', () => {
      expect(() => handler.handleError(42)).toThrow();
    });

    it('should rethrow boolean errors', () => {
      expect(() => handler.handleError(true)).toThrow();
    });

    it('should rethrow object errors that are not MatSortable duplicate', () => {
      const error = new Error('some other error');
      expect(() => handler.handleError(error)).toThrowError('some other error');
    });

    it('should rethrow Error objects', () => {
      const error = new TypeError('type error');
      expect(() => handler.handleError(error)).toThrowError('type error');
    });

    it('should handle MatSortable duplicate error with console.warn', () => {
      const warnSpy = spyOn(console, 'warn');
      const error = new Error('Cannot have two MatSortables with the same id (myColumn)');
      handler.handleError(error);
      expect(warnSpy).toHaveBeenCalledWith("Duplicated sorting header 'myColumn'.");
    });

    it('should not throw for MatSortable duplicate error', () => {
      const error = new Error('Cannot have two MatSortables with the same id (header)');
      expect(() => handler.handleError(error)).not.toThrow();
    });

    it('should rethrow objects without toString matching MatSortable message', () => {
      const customObj = {toString: () => 'Unrelated error message'};
      expect(() => handler.handleError(customObj)).toThrow();
    });
  });
});

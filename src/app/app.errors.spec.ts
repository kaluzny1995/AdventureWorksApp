import { InternalServerError, OptionalParamError, ColumnNotFoundError, FilterNameError, FilterValueError } from './app.errors';

describe('Error Classes', () => {
  describe('InternalServerError', () => {
    it('should create with message', () => {
      const error = new InternalServerError('test message');
      expect(error).toBeInstanceOf(InternalServerError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('test message');
    });

    it('should have correct name', () => {
      const error = new InternalServerError('test');
      expect(error.name).toBe('Error');
    });

    it('should have stack trace', () => {
      const error = new InternalServerError('test');
      expect(error.stack).toBeDefined();
    });
  });

  describe('OptionalParamError', () => {
    it('should create with message', () => {
      const error = new OptionalParamError('bad param');
      expect(error).toBeInstanceOf(OptionalParamError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('bad param');
    });
  });

  describe('ColumnNotFoundError', () => {
    it('should create with message', () => {
      const error = new ColumnNotFoundError('column not found');
      expect(error).toBeInstanceOf(ColumnNotFoundError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('column not found');
    });
  });

  describe('FilterNameError', () => {
    it('should create with message', () => {
      const error = new FilterNameError('bad filter');
      expect(error).toBeInstanceOf(FilterNameError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('bad filter');
    });
  });

  describe('FilterValueError', () => {
    it('should create with message', () => {
      const error = new FilterValueError('bad value');
      expect(error).toBeInstanceOf(FilterValueError);
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('bad value');
    });
  });

  describe('prototype chain', () => {
    it('should correctly set prototype for each error class', () => {
      expect(new InternalServerError('') instanceof Error).toBeTrue();
      expect(new OptionalParamError('') instanceof Error).toBeTrue();
      expect(new ColumnNotFoundError('') instanceof Error).toBeTrue();
      expect(new FilterNameError('') instanceof Error).toBeTrue();
      expect(new FilterValueError('') instanceof Error).toBeTrue();
    });

    it('should not be cross-instance', () => {
      expect(new InternalServerError('') instanceof OptionalParamError).toBeFalse();
      expect(new FilterNameError('') instanceof FilterValueError).toBeFalse();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { FormValidationService } from './form-validation.service';

describe('FormValidationService', () => {
  let service: FormValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateFormGroup', () => {
    it('should mark all controls as touched', () => {
      const formGroup = new FormGroup({
        field1: new FormControl(''),
        field2: new FormControl('')
      });
      service.validateFormGroup(formGroup);
      expect(formGroup.get('field1')?.touched).toBeTrue();
      expect(formGroup.get('field2')?.touched).toBeTrue();
    });

    it('should mark nested FormGroup controls as touched', () => {
      const nested = new FormGroup({
        nestedField: new FormControl('')
      });
      const formGroup = new FormGroup({
        field1: new FormControl(''),
        nested: nested
      });
      service.validateFormGroup(formGroup);
      expect(formGroup.get('field1')?.touched).toBeTrue();
      expect(nested.get('nestedField')?.touched).toBeTrue();
    });
  });

  describe('ForbiddenValueValidator', () => {
    it('should return null when value is not forbidden', () => {
      const validator = service.ForbiddenValueValidator(['admin', 'root']);
      const control = new FormControl('user');
      expect(validator(control)).toBeNull();
    });

    it('should return error when value matches forbidden name', () => {
      const validator = service.ForbiddenValueValidator(['admin', 'root']);
      const control = new FormControl('admin');
      expect(validator(control)).toEqual({forbidden: {value: 'admin'}});
    });

    it('should return null for empty array of forbidden names', () => {
      const validator = service.ForbiddenValueValidator([]);
      const control = new FormControl('anything');
      expect(validator(control)).toBeNull();
    });
  });

  describe('PasswordsMatchingValidator', () => {
    it('should return null when passwords match', () => {
      const formGroup = new FormGroup({
        password: new FormControl('secret'),
        confirmPassword: new FormControl('secret')
      });
      const validatorFn = service.PasswordsMatchingValidator('password', 'confirmPassword') as any;
      const result = validatorFn(formGroup);
      expect(result).toBeNull();
    });

    it('should set error when passwords do not match', () => {
      const formGroup = new FormGroup({
        password: new FormControl('secret'),
        confirmPassword: new FormControl('different')
      });
      const validatorFn = service.PasswordsMatchingValidator('password', 'confirmPassword') as any;
      validatorFn(formGroup);
      expect(formGroup.get('confirmPassword')?.errors).toEqual({match: true});
    });
  });

  describe('XMLValidator', () => {
    it('should return null for valid XML', () => {
      const validator = service.XMLValidator();
      const control = new FormControl('<root><child>text</child></root>');
      expect(validator(control)).toBeNull();
    });

    it('should return null for null value', () => {
      const validator = service.XMLValidator();
      const control = new FormControl(null);
      expect(validator(control)).toBeNull();
    });

    it('should return error for invalid XML', () => {
      const validator = service.XMLValidator();
      const control = new FormControl('not xml at all');
      expect(validator(control)).toEqual({xml: true});
    });
  });
});

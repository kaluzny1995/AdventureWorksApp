import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import xmlFormat from 'xml-formatter';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  /**
   * Validates given form group
  */
  validateFormGroup(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateFormGroup(control);
      }
    });
  }

  /**
   * Validates if the assigned control has not got any of the provided values
  */
  ForbiddenValueValidator(forbiddenNames: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regExps = forbiddenNames.map(fn => new RegExp(`^${fn}$`));
      const forbidden = regExps.some((re: RegExp) => re.test(control.value));
      return forbidden ? { forbidden: { value: control.value } } : null;
    };
  }

  /**
   * Validates if the two password controls have the same value
  */
  PasswordsMatchingValidator(controlName: string, matchingControlName: string): ValidationErrors {
    return (formGroup: FormGroup): { [key: string]: any } | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.match) {
        delete matchingControl.errors.match;
        return null;
      }
      let result = control.value !== matchingControl.value? {match: true} : null;
      matchingControl.setErrors(result);
      return result;
    };
  }

  /**
   * Validates if the assigned control has got appropriate XML string
  */
  XMLValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      try {
        if (control.value !== null) {
          xmlFormat(control.value)
        }
        return null;
      } catch (error: unknown) {
        return {xml: true};
      }
    };
  }
}

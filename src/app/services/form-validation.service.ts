import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  ForbiddenValueValidator(forbiddenNames: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regExps = forbiddenNames.map(fn => new RegExp(`^${fn}$`));
      const forbidden = regExps.some((re: RegExp) => re.test(control.value));
      return forbidden ? { forbidden: { value: control.value } } : null;
    };
  }

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
}

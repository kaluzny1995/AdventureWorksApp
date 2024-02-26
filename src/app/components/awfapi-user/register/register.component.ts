import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { RegisteredUser } from 'src/app/models/awfapi-user/registered-user';
import { EAuthenticationStatus } from 'src/app/models/utils/e-authentication-status';
import { AlertMessageService } from 'src/app/services/utils/alert-message.service';
import { AppConfigService } from 'src/app/services/utils/app-config.service';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { AwfapiUserService } from 'src/app/services/awfapi-user/awfapi-user.service';
import { FormValidationService } from 'src/app/services/utils/form-validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  mainAlert: AlertMessage | null = null;

  form: FormGroup;
  username: FormControl;
  password: FormControl;
  repeatedPassword: FormControl;
  fullName: FormControl;
  email: FormControl;
  isReadonly: FormControl;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _appConfig: AppConfigService,
    private _auth: AuthenticationService,
    private _fv: FormValidationService,
    private _userService: AwfapiUserService,
    private _alert: AlertMessageService
  ) { }

  ngOnInit(): void {
    /* Form initialization */
    this.username = new FormControl(null, [Validators.required, this._fv.ForbiddenValueValidator(this._appConfig.forbiddenUsernames)]);
    this.password = new FormControl(null, Validators.required);
    this.repeatedPassword = new FormControl(null, Validators.required);
    this.fullName = new FormControl(null, Validators.required);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.isReadonly = new FormControl(false);
    this.form = this._fb.group({
      username: this.username,
      password: this.password,
      repeatedPassword: this.repeatedPassword,
      fullName: this.fullName,
      email: this.email,
      isReadonly: this.isReadonly
    }, {validator: this._fv.PasswordsMatchingValidator('password', 'repeatedPassword')});
  }

  /**
   * Clears non-unique value error (for username and email fields)
  */
  clearUniqueError(fieldName: string): void {
    switch (fieldName) {
      case 'username': {
        if (this.username.hasError('unique')) {
          delete this.username?.errors?.unique;
        }
        break;
      }
      case 'email': {
        if (this.email.hasError('unique')) {
          delete this.email?.errors?.unique;
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Registers new user
  */
  register(): void {
    const registeredUser: RegisteredUser = RegisteredUser.fromFormStructure(this.form.value);

    this._userService.register(registeredUser.toAPIStructure()).subscribe({
      next: (result: any) => {
        console.log('New user registered successfully.', result);
        this._router.navigate(['authenticate', {status: AlertMessage.SIGNUP_SUCCESS}]);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while registering new user.', error);
        if (error.status === 400) {
          const errorMessage = error.error.detail.title;
          if (errorMessage.includes('username')) {
            this.username.setErrors({unique: true});
          }
          if (errorMessage.includes('email')) {
            this.email.setErrors({unique: true});
          }
        } else {
          this.mainAlert = this._alert.statusAlertMesssage(error.status);
        }
      }
    });
  }
}

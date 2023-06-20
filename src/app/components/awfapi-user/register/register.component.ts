import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/alert-message';
import { RegisteredUser } from 'src/app/models/awfapi-user/registered-user';
import { EAuthenticationStatus } from 'src/app/models/e-authentication-status';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AwfapiUserService } from 'src/app/services/awfapi-user.service';
import { FormValidationService } from 'src/app/services/form-validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  username: FormControl;
  password: FormControl;
  repeatedPassword: FormControl;
  fullName: FormControl;
  email: FormControl;
  isReadonly: FormControl;

  constructor(
    private _fb: FormBuilder, private _router: Router,
    private _appConfig: AppConfigService, private _auth: AuthenticationService,
    private _fv: FormValidationService, private _userService: AwfapiUserService
  ) { }

  ngOnInit(): void {
    this._auth.testAuthentication().subscribe({
      next: (response: any) => {
        if (response.title === EAuthenticationStatus.AUTHENTICATED) {
          console.log('Signed up. Sign out before continuing. Redirecting home.');
          this._router.navigate(['home', {status: AlertMessage.SIGNOUT_REQUIRED}]);
        }
      },
      error: (error) => {
        console.error('Error while checking authentication status.', error);
        this._router.navigate(['home', {status: AlertMessage.UNKNOWN_ERROR}]);
      }
    });

    this.username = new FormControl('', [Validators.required, this._fv.ForbiddenValueValidator(this._appConfig.forbiddenUsernames)]);
    this.password = new FormControl('', Validators.required);
    this.repeatedPassword = new FormControl('', Validators.required);
    this.fullName = new FormControl('', Validators.required);
    this.email = new FormControl('', [Validators.required, Validators.email]);
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

  register(): void {
    const registeredUser: RegisteredUser = RegisteredUser.fromFormStructure(this.form.value);
    console.log('Registered user:', registeredUser);

    this._userService.register(
        registeredUser.toAPIStructure()
      ).subscribe({
      next: (result: any) => {
        console.log('New user registered successfully.', result);
        this._router.navigate(['authenticate', {status: AlertMessage.SIGNUP_SUCCESS}]);
      },
      error: (error) => {
        console.error('Error while registering new user.', error);
        let errorMessage = error.error.detail.title;
        if (errorMessage.includes('username')) {
          this.username.setErrors({unique: true});
        }
        if (errorMessage.includes('email')) {
          this.email.setErrors({unique: true});
        }
      }
    });
  }
}

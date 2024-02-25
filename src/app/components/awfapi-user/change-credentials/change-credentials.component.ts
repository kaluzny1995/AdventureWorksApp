import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { ChangedUserCredentials } from 'src/app/models/awfapi-user/changed-user-credentials';
import { AlertMessageService } from 'src/app/services/utils/alert-message.service';
import { AppConfigService } from 'src/app/services/utils/app-config.service';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { AwfapiUserService } from 'src/app/services/awfapi-user/awfapi-user.service';
import { FormValidationService } from 'src/app/services/utils/form-validation.service';

@Component({
  selector: 'app-change-credentials',
  templateUrl: './change-credentials.component.html',
  styleUrls: ['./change-credentials.component.scss']
})
export class ChangeCredentialsComponent implements OnInit {
  mainAlert: AlertMessage | null = null;

  form: FormGroup;
  changeType: FormControl;
  newUsername: FormControl;
  currentPassword: FormControl;
  newPassword: FormControl;
  repeatedPassword: FormControl;

  constructor(
    private _appConfig: AppConfigService,
    private _userService: AwfapiUserService,
    private _auth: AuthenticationService,
    private _fv: FormValidationService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alert: AlertMessageService
  ) {}

  ngOnInit(): void {
    /* Status alerts setting */
    if (this._route.snapshot.paramMap.has('status')) {
      const status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'signed_in': {
          this.mainAlert = AlertMessage.SIGNED_IN;
          break;
        }
        default: {
          this.mainAlert = AlertMessage.UNKNOWN_STATUS;
          break;
        }
      }
    }

    /* Form initialization */
    this.changeType = new FormControl('both');
    this.newUsername = new FormControl(null, [Validators.required, this._fv.ForbiddenValueValidator(this._appConfig.forbiddenUsernames)]);
    this.currentPassword = new FormControl(null, Validators.required);
    this.newPassword = new FormControl(null, Validators.required);
    this.repeatedPassword = new FormControl(null, Validators.required);
    this.form = this._fb.group({
      changeType: this.changeType,
      newUsername: this.newUsername,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      repeatedPassword: this.repeatedPassword
    }, {validator: this._fv.PasswordsMatchingValidator('newPassword', 'repeatedPassword')});

    /* Switching fields enability dependently on credentials change type */
    this.changeType.valueChanges.subscribe(value => {
      switch (value) {
        case 'username': {
          this.newUsername.enable();
          this.newPassword.disable();
          this.newPassword.reset();
          this.repeatedPassword.disable();
          this.repeatedPassword.reset();
          break;
        }
        case 'password': {
          this.newUsername.disable();
          this.newUsername.reset();
          this.newPassword.enable();
          this.repeatedPassword.enable();
          break;
        }
        default: {
          this.newUsername.enable();
          this.newPassword.enable();
          this.repeatedPassword.enable();
          break;
        }
      }
    });
  }

  /**
   * Clears non-unique value error (for new username field) and current password invalidity error
  */
  clearUniqueError(fieldName: string): void {
    switch (fieldName) {
      case 'newUsername': {
        if (this.newUsername.hasError('unique')) {
          delete this.newUsername?.errors?.unique;
        }
        break;
      }
      case 'currentPassword': {
        if (this.currentPassword.hasError('password')) {
          delete this.currentPassword?.errors?.password;
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Changes current users credentials
  */
  changeCredentials(): void {
    const changedUserCredentials: ChangedUserCredentials = ChangedUserCredentials.fromFormStructure(this.form.value);

    const awfapiUsername: string = this._auth.getUsernameFromToken();
    this._userService.changeCredentials(awfapiUsername, changedUserCredentials.toAPIStructure()).subscribe({
    next: (result: any) => {
      console.log('User credentials changed successfully.', result);
      if (this.changeType.value === 'password') {
        this._router.navigate(['profile', {status: AlertMessage.USER_CRED_CHANGED}]).then(() => {
          window.location.reload();
        });
      } else {
        this._auth.removeToken();
        this._router.navigate(['authenticate', {status: AlertMessage.USER_CRED_CH_SIGNOUT, returnUrl: '/profile'}]).then(() => {
          window.location.reload();
        });
      }
    },
    error: (error: HttpErrorResponse) => {
      console.error('Error while changing user credentials.', error);
      if (error.status === 400) {
        const errorMessage = error.error.detail.title;
        if (errorMessage.includes('username')) {
          this.newUsername.setErrors({unique: true});
        }
        if (errorMessage.includes('password')) {
          this.currentPassword.setErrors({password: true});
        }
      } else {
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    }
  });
  }
}

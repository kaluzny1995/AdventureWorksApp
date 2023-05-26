import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/alert-message';
import { ChangedUserCredentials } from 'src/app/models/awfapi-user/changed-user-credentials';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AwfapiUserService } from 'src/app/services/awfapi-user.service';
import { FormValidationService } from 'src/app/services/form-validation.service';

@Component({
  selector: 'app-change-credentials',
  templateUrl: './change-credentials.component.html',
  styleUrls: ['./change-credentials.component.scss']
})
export class ChangeCredentialsComponent implements OnInit {
  mainAlert: AlertMessage | null = null;
  mainAlertDismiss() {
    this.mainAlert = null;
  }

  form: FormGroup;
  changeType: FormControl;
  newUsername: FormControl;
  currentPassword: FormControl;
  newPassword: FormControl;
  repeatedPassword: FormControl;

  constructor(
    private _appConfig: AppConfigService, private _userService: AwfapiUserService,
    private _auth: AuthenticationService, private _fv: FormValidationService,
    private _fb: FormBuilder, private _route: ActivatedRoute, private _router: Router
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.paramMap.has('status')) {
      let status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'signed_in': {
          this.mainAlert = AlertMessage.SIGNED_IN;
          break;
        }
        case 'user_cred_changed': {
          this.mainAlert = AlertMessage.USER_CRED_CHANGED;
          break;
        }
        case 'user_cred_ch_signout': {
          this.mainAlert = AlertMessage.USER_CRED_CH_SIGNOUT;
          break;
        }
        default: {
          this.mainAlert = AlertMessage.UNKNOWN_STATUS;
          break;
        }
      }
    }

    this.changeType = new FormControl('both');
    this.newUsername = new FormControl('', [Validators.required, this._fv.ForbiddenValueValidator(this._appConfig.forbiddenUsernames)]);
    this.currentPassword = new FormControl('', Validators.required);
    this.newPassword = new FormControl('', Validators.required);
    this.repeatedPassword = new FormControl('', Validators.required);
    this.form = this._fb.group({
      changeType: this.changeType,
      newUsername: this.newUsername,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      repeatedPassword: this.repeatedPassword
    }, {validator: this._fv.PasswordsMatchingValidator('newPassword', 'repeatedPassword')});

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

  changeCredentials(): void {
    const changedUserCredentials: ChangedUserCredentials = new ChangedUserCredentials(this.form.value);
    console.log('Changed user credentials:', changedUserCredentials);

    this._auth.getCurrentUser().subscribe({
      next: (result: any) => {
        this._userService.changeCredentials(result.username, {
          new_username: changedUserCredentials.newUsername,
          current_password: changedUserCredentials.currentPassword,
          new_password: changedUserCredentials.newPassword,
          repeated_password: changedUserCredentials.repeatedPassword
        }).subscribe({
          next: (result: any) => {
            console.log('User credentials changed successfully.', result);
            if (this.changeType.value === 'password') {
              this._router.navigate(['change-credentials', {status: AlertMessage.USER_CRED_CHANGED}]).then(() => {
                window.location.reload();
              });
            } else {
              this._auth.removeToken();
              this._router.navigate(['authenticate', {status: AlertMessage.USER_CRED_CH_SIGNOUT}]).then(() => {
                window.location.reload();
              });
            }
          },
          error: (error) => {
            console.error('Error while changing user credentials.', error);
            let errorMessage = error.error.detail.info;
            if (errorMessage.includes('username')) {
              this.newUsername.setErrors({unique: true});
            }
            if (errorMessage.includes('password')) {
              this.currentPassword.setErrors({password: true});
            }
          }
        });
      },
      error: (error) => {
        console.error('Error while loading current user data.', error);
      }
    });
  }
}

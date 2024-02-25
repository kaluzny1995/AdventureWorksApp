import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { EAuthenticationStatus } from 'src/app/models/utils/e-authentication-status';
import { AlertMessageService } from 'src/app/services/utils/alert-message.service';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { UrlProcessingService } from 'src/app/services/url/url-processing.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  mainAlert: AlertMessage | null = null;

  form: FormGroup;
  username: FormControl;
  password: FormControl;
  
  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _auth: AuthenticationService,
    private _urlProc: UrlProcessingService,
    private _alert: AlertMessageService
  ) { }

  ngOnInit(): void {
    /* Checking authentication status, if authenticated then redirect */
    this._auth.testAuthentication().subscribe({
      next: (response: any) => {
        if (response.title === EAuthenticationStatus.AUTHENTICATED) {
          console.log('Already authenticated. Redirecting home.');
          this._router.navigate(['home', {status: AlertMessage.ALREADY_AUTH}]);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while checking authentication status.', error);
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    });

    /* Status alerts setting */
    if (this._route.snapshot.paramMap.has('status')) {
      const status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'auth_required': {
          this.mainAlert = AlertMessage.AUTH_REQUIRED;
          break;
        }
        case 'jwt_token_expired': {
          this.mainAlert = AlertMessage.JWT_TOKEN_EXPIRED;
          break;
        }
        case 'user_cred_ch_signout': {
          this.mainAlert = AlertMessage.USER_CRED_CH_SIGNOUT;
          break;
        }
        case 'signup_success': {
          this.mainAlert = AlertMessage.SIGNUP_SUCCESS;
          break;
        }
        case 'unknown_auth_status': {
          this.mainAlert = AlertMessage.UNKNOWN_AUTH_STATUS;
          break;
        }
        default: {
          this.mainAlert = AlertMessage.UNKNOWN_STATUS;
          break;
        }
      }
    }

    /* Form initialization */
    this.username = new FormControl(null, Validators.required);
    this.password = new FormControl(null, Validators.required);
    this.form = this._fb.group({
      username: this.username,
      password: this.password
    });
  }

  /**
   * Authenticates users
  */
  login(): void {
    const credentials: any = this.form.value;
    const credentialsData: FormData = new FormData();
    credentialsData.append('username', credentials.username);
    credentialsData.append('password', credentials.password);

    this._auth.authenticate(credentialsData).subscribe({
      next: (result) => {
        console.log('Successful logging:', result);
        this._auth.setToken(result.access_token);
        
        if (!this._route.snapshot.paramMap.has('returnUrl')) {
          this._router.navigate(['home', {status: AlertMessage.SIGNED_IN}]).then(() => {
            window.location.reload();
          });
        } else {
          const returnUrlAddress: string = this._route.snapshot.paramMap.get('returnUrl') || '';
          const urlBase: string = this._urlProc.base(returnUrlAddress);
          let urlOptionalParams: {[key: string]: string} = this._urlProc.optParams(returnUrlAddress);
          urlOptionalParams['status'] = AlertMessage.SIGNED_IN.status;

          this._router.navigate([urlBase, urlOptionalParams]).then(() => {
            window.location.reload();
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while logging:', error);
        if (error.status === 401) {
          this.mainAlert = AlertMessage.AUTH_ERROR;
        } else {
          this.mainAlert = this._alert.statusAlertMesssage(error.status);
        }
      }
    });
  }
}

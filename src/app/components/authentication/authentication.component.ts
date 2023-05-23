import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/alert-message';
import { EAuthenticationStatus } from 'src/app/models/e-authentication-status';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  mainAlert: AlertMessage | null = null;
  mainAlertDismiss() {
    this.mainAlert = null;
  }

  form: FormGroup;
  username: FormControl;
  password: FormControl;

  authenticationAlert: AlertMessage | null = null;
  authenticationAlertDismiss() {
    this.authenticationAlert = null;
  }
  
  constructor(
    private _fb: FormBuilder, private _route: ActivatedRoute,
    private _router: Router, private _auth: AuthenticationService,
    private _util: UtilsService
  ) { }

  ngOnInit(): void {
    this._auth.testAuthentication().subscribe({
      next: (response: any) => {
        if (response.message === EAuthenticationStatus.AUTHENTICATED) {
          console.log('Already authenticated. Redirecting home.');
          this._router.navigate(['home', {status: AlertMessage.ALREADY_AUTH}]);
        }
      },
      error: (error) => {
        console.error('Error while checking authentication status.', error);
        this._router.navigate(['home', {status: AlertMessage.UNKNOWN_ERROR}]);
      }
    });

    if (this._route.snapshot.paramMap.has('status')) {
      let status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'auth_required': {
          this.mainAlert = AlertMessage.AUTH_REQUIRED;
          break;
        }
        case 'jwt_token_expired': {
          this.mainAlert = AlertMessage.JWT_TOKEN_EXPIRED;
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

    this.username = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
    this.form = this._fb.group({
      username: this.username,
      password: this.password
    });
  }

  login() {
    const credentials = this.form.value;
    console.log('Credentials:', credentials);

    const credentialsData = new FormData();
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
          let returnUrlAddress = this._route.snapshot.paramMap.get('returnUrl') || '';
          let urlBase = this._util.getUrlBase(returnUrlAddress);
          let urlOptionalParams = this._util.getUrlOptionalParams(returnUrlAddress);
          urlOptionalParams['status'] = AlertMessage.SIGNED_IN;

          this._router.navigate([urlBase, urlOptionalParams]).then(() => {
            window.location.reload();
          });
        }
      },
      error: (error) => {
        console.error('Error while logging:', error);
        this.authenticationAlert = AlertMessage.AUTH_ERROR;
      }
    });
  }

}

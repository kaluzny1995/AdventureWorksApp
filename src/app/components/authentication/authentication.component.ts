import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EAuthenticationStatus } from 'src/app/models/e-authentication-status';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  mainAlert: any = {message: null, type: null};
  mainAlertDismiss() {
    this.mainAlert = {message: null, type: null};
  }

  form: FormGroup;
  username: FormControl;
  password: FormControl;

  authenticationAlert: any = {message: null, type: null};
  authenticationAlertDismiss() {
    this.authenticationAlert = {message: null, type: null};
  }
  
  constructor(
    private _fb: FormBuilder, private _route: ActivatedRoute,
    private _router: Router, private _auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    this._auth.testAuthentication().subscribe({
      next: (response: any) => {
        if (response.message === EAuthenticationStatus.AUTHENTICATED) {
          console.log('Already authenticated. Redirecting home.');
          this._router.navigate(['home', {message: 'Already authenticated.', type: 'info'}]);
        }
      },
      error: (error) => {
        console.error('Error while checking authentication status.', error);
        this._router.navigate(['home', {message: 'Unknown error occurred.', type: 'danger'}]);
      }
    });

    if (this._route.snapshot.paramMap.has('message')) {
      let message = this._route.snapshot.paramMap.get('message');
      let type = this._route.snapshot.paramMap.get('type');

      this.mainAlert = {message: message, type: type};
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
          this._router.navigate(['home', {message: 'Signed in.', type: 'info'}]).then(() => {
            window.location.reload();
          });
        } else {
          this._router.navigate([this._route.snapshot.paramMap.get('returnUrl')]).then(() => {
            window.location.reload();
          });
        }
      },
      error: (error) => {
        console.error('Error while logging:', error);
        this.authenticationAlert = {message: 'Wrong username or password.', type: 'danger'};
      }
    });
  }

}

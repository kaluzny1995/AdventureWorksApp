import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/alert-message';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
  isAuthenticated: boolean
  username: string
  isReadonly: boolean
  readonlyWarning: string

  constructor(private _router: Router, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    this.isAuthenticated = this._auth.isAuthenticated();

    if (this.isAuthenticated) {
      this._auth.getCurrentUser().subscribe({
        next: (result: any) => {
          this.username = result.username;
          this.isReadonly = Boolean(result.is_readonly);
        },
        error: (error) => {
          console.error('Failed to retrieve username.', error);
        }
      });
    }

    this.readonlyWarning = "User has readonly access.";
  }

  signIn() {
    this._router.navigate(['authenticate']);
  }

  signUp() {
    this._router.navigate(['register']);
  }

  viewProfile() {
    this._router.navigate(['profile']);
  }

  signOut() {
    this._auth.removeToken();
    this._router.navigate(['home', {status: AlertMessage.SIGNED_OUT}]).then(() => {
      window.location.reload();
    });
  }
}

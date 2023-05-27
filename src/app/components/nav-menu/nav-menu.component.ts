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
  fullName: string
  isReadonly: boolean
  readonlyWarning: string

  constructor(private _router: Router, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    this.isAuthenticated = this._auth.isAuthenticated();

    if (this.isAuthenticated) {
      this._auth.getCurrentUser().subscribe({
        next: (result: any) => {
          this.username = result.username;
          this.fullName = result.full_name;
          this.isReadonly = Boolean(result.is_readonly);
        },
        error: (error) => {
          console.error('Error while loading current user data.', error);
        }
      });
    }

    this.readonlyWarning = "User has readonly access.";
  }

  signIn(): void {
    this._router.navigate(['authenticate']);
  }

  signUp(): void {
    this._router.navigate(['register']);
  }

  viewProfile(): void {
    this._router.navigate(['profile']);
  }

  changeData(): void {
    this._router.navigate(['change-data']);
  }

  changeCredentials(): void {
    this._router.navigate(['change-credentials']);
  }

  signOut(): void {
    this._auth.removeToken();
    this._router.navigate(['home', {status: AlertMessage.SIGNED_OUT}]).then(() => {
      window.location.reload();
    });
  }
}

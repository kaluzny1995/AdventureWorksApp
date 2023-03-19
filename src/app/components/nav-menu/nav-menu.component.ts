import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
  isAuthenticated: boolean
  username: string

  constructor(private _router: Router, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    this.isAuthenticated = this._auth.isAuthenticated();

    if (this.isAuthenticated) {
      this._auth.getCurrentUser().subscribe({
        next: (result: any) => {
          this.username = result.username;
        },
        error: (error) => {
          console.error('Failed to retrieve username.', error);
        }
      });
    }
  }

  signIn() {
    this._router.navigate(['authenticate']);
  }

  signUp() {
    // under construction, after mongodb setup
  }

  viewProfile() {
    this._router.navigate(['profile']);
  }

  signOut() {
    this._auth.removeToken();
    this._router.navigate(['home', {message: 'Signed out.', type: 'info'}]).then(() => {
      window.location.reload();
    });
  }
}

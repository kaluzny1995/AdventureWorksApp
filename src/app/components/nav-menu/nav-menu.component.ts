import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { ViewedUser } from 'src/app/models/awfapi-user/viewed-user';
import { EAuthenticationStatus } from 'src/app/models/utils/e-authentication-status';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {
  isAuthenticated: boolean;
  currentUser: ViewedUser | null;
  readonlyWarning: string;

  constructor(
    private _router: Router,
    private _auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    /* Checking authentication status */
    this._auth.testAuthentication().subscribe({
      next: (result: any) => {
        if (result.title !== EAuthenticationStatus.AUTHENTICATED) {
          this.isAuthenticated = false;
          this.currentUser = null;
        } else {
          this.isAuthenticated = true;

          /* If authenticated then loading current users data*/
          this._auth.getCurrentUser().subscribe({
            next: (result: any) => {
              this.currentUser = ViewedUser.fromAPIStructure(result);
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error while loading current user data.', error);
            }
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while checking authentication status.', error);
      }
    });

    this.readonlyWarning = "User has readonly access.";
  }

  /**
   * Signs out and reloads all view components
  */
  signOut(): void {
    this._auth.removeToken();
    this._router.navigate(['home', {status: AlertMessage.SIGNED_OUT}]).then(() => {
      window.location.reload();
    });
  }
}

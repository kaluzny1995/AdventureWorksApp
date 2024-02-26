import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/awfapi-user/authentication.service';
import { EAuthenticationStatus } from '../models/utils/e-authentication-status';
import { AlertMessage } from '../models/utils/alert-message';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotSignedInGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _auth: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isActivated: boolean = true;

    this._auth.testAuthentication().subscribe({
      next: (response: any) => {
        if (response.title === EAuthenticationStatus.AUTHENTICATED) {
          const alert: AlertMessage = state.url.includes('/authenticate') ? AlertMessage.ALREADY_AUTH : AlertMessage.SIGNOUT_REQUIRED;
          this._router.navigate(['home', {status: alert}]);
          isActivated = false;
        } else {
          isActivated = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while checking authentication status.', error);
        isActivated = true;
      }
    });

    return isActivated;
  }
  
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AlertMessage } from '../models/utils/alert-message';
import { EAuthenticationStatus } from '../models/utils/e-authentication-status';
import { AuthenticationService } from '../services/awfapi-user/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private _router: Router, private _auth: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isActivated: boolean = true;

    this._auth.testAuthentication().subscribe({
      next: (response: any) => {
        console.log('Authentication status result:', response);
        
        switch(response.title) {
          case EAuthenticationStatus.AUTHENTICATED: {
            isActivated = true;
            break;
          }
          case EAuthenticationStatus.UNAUTHENTICATED: {
            this._auth.removeToken();
            this._router.navigate(['authenticate', {status: AlertMessage.AUTH_REQUIRED, returnUrl: state.url}]).then(() => {
              window.location.reload();
            });
            isActivated = false;
            break;
          }
          case EAuthenticationStatus.EXPIRED: {
            this._auth.removeToken();
            this._router.navigate(['authenticate', {status: AlertMessage.JWT_TOKEN_EXPIRED, returnUrl: state.url}]).then(() => {
              window.location.reload();
            });
            isActivated = false;
            break;
          }
          default: {
            this._auth.removeToken();
            this._router.navigate(['authenticate', {status: AlertMessage.UNKNOWN_AUTH_STATUS, returnUrl: state.url}]).then(() => {
              window.location.reload();
            });
            isActivated = true;
            break;
          }
        }
      },
      error: (error) => {
        console.error('Error while checking authentication status.', error);
        this._router.navigate(['home', {status: AlertMessage.UNKNOWN_ERROR}]);
        isActivated = true;
      }
    });

    return isActivated;
  }
  
}

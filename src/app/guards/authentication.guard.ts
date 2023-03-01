import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { EAuthenticationStatus } from '../models/e-authentication-status';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private _router: Router, private _auth: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isActivated: boolean = true;

    this._auth.testAuthentication().subscribe({
      next: (response: any) => {
        console.log('Authentication status:', response.message);
        
        switch(response.message) {
          case EAuthenticationStatus.AUTHENTICATED: {
            isActivated = true;
            break;
          }
          case EAuthenticationStatus.UNAUTHENTICATED: {
            this._auth.removeToken();
            this._router.navigate(['authenticate', {message: 'You must sign in before continuing.', type: 'warning', returnUrl: state.url}]).then(() => {
              window.location.reload();
            });
            isActivated = false;
            break;
          }
          case EAuthenticationStatus.EXPIRED: {
            this._auth.removeToken();
            this._router.navigate(['authenticate', {message: 'JWT token expired. Sign in again.', type: 'warning', returnUrl: state.url}]).then(() => {
              window.location.reload();
            });
            isActivated = false;
            break;
          }
          default: {
            this._auth.removeToken();
            this._router.navigate(['authenticate', {message: 'Unknown authentication status.', type: 'warning', returnUrl: state.url}]).then(() => {
              window.location.reload();
            });
            isActivated = true;
            break;
          }
        }
      },
      error: (error) => {
        console.error('Error while checking authentication status.', error);
        this._router.navigate(['home', {message: 'Unknown error occurred.', type: 'danger'}]);
        isActivated = true;
      }
    });

    return isActivated;
  }
  
}

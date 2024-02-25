import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/awfapi-user/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NonReadonlyGuard implements CanActivate {
constructor(private _router: Router, private _auth: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let isActivated: boolean = true;

    this._auth.getCurrentUser().subscribe({
      next: (result: any) => {
        if (!Boolean(result.is_readonly)) /*current user had non-readonly access*/ {
          isActivated = true;
        } else {
          this._router.navigate(['403', {returnUrl: state.url}]);
          isActivated = false;
        }
      },
      error: (error: HttpErrorResponse) => {}
    });

    return true;
  }
  
}

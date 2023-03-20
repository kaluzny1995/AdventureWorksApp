import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_REQUIRED_ADDRESSES, FAST_API_SERVER } from '../app.constants';
import { AppConfigService } from './app-config.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptionService implements HttpInterceptor {

  constructor(private _appConfig: AppConfigService, private _auth: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request intercepted:', req.url);

    // --> such solution throws an error: Error while loading config file TypeError: Cannot read properties of undefined (reading 'api')
    /*const address = req.url.replace(this._appConfig.apiUrl, '');
    if (this._appConfig.authRequiredEndpoints.some((e: any) => e === address)) {*/

    const address = req.url.replace(FAST_API_SERVER, '');
    if (AUTH_REQUIRED_ADDRESSES.some((e: any) => e === address)) {
      console.log('Authentication required for:', req.url);

      req = req.clone({headers: req.headers.set('Accept', 'application/json')}).clone({
        setHeaders: {
          Authorization: `Bearer ${this._auth.getToken()}`
        }
      });
    }

    return next.handle(req);
  }
}

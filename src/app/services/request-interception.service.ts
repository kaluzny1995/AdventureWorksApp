import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_REQUIRED_ADDRESSES, FAST_API_SERVER } from '../app.constants';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptionService implements HttpInterceptor {

  constructor(private _authentication: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request intercepted:', req.url);

    const address = req.url.replace(FAST_API_SERVER, '');
    if (AUTH_REQUIRED_ADDRESSES.some((e: any) => e === address)) {
      console.log('Authentication required for:', req.url);

      req = req.clone({headers: req.headers.set('Accept', 'application/json')}).clone({
        setHeaders: {
          Authorization: `Bearer ${this._authentication.getToken()}`
        }
      });
    }

    return next.handle(req);
  }
}

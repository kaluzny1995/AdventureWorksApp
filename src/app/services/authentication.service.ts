import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _appConfig: AppConfigService, private _http: HttpClient) { }

  authenticate(credentials: FormData): Observable<any> {
    return this._http.post<any>(this._appConfig.apiUrl + 'token', credentials);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  testAuthentication(): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + 'test');
  }

  verifyPassword(password: string): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `verify/${password}`);
  }

  getCurrentUser(): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + 'current_user');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }
}

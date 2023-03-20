import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _appConfig: AppConfigService, private _http: HttpClient) { }

  authenticate(credentials: FormData) {
    return this._http.post<any>(this._appConfig.apiUrl + 'token', credentials);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  testAuthentication() {
    return this._http.get<any>(this._appConfig.apiUrl + 'test');
  }

  getCurrentUser() {
    return this._http.get<any>(this._appConfig.apiUrl + 'current_user');
  }

  removeToken() {
    localStorage.removeItem('token');
  }
}

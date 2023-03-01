import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FAST_API_SERVER } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _http: HttpClient) { }

  authenticate(credentials: FormData) {
    return this._http.post<any>(FAST_API_SERVER + 'token', credentials);
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
    return this._http.get<any>(FAST_API_SERVER + 'test');
  }

  getCurrentUser() {
    return this._http.get<any>(FAST_API_SERVER + 'current_user');
  }

  removeToken() {
    localStorage.removeItem('token');
  }
}

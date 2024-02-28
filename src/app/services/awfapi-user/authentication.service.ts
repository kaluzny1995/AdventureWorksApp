import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../utils/app-config.service';
import { Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private _appConfig: AppConfigService,
    private _local: LocalStorageService,
    private _http: HttpClient
  ) { }

  authenticate(credentials: FormData): Observable<any> {
    return this._http.post<any>(this._appConfig.apiUrl + 'token', credentials);
  }

  setToken(token: string): void {
    this._local.setItem('token', token);
  }

  getToken(): string {
    return this._local.getItem('token') || '';
  }

  getUsernameFromToken(): string {
    const tokenData: any = jwtDecode(this.getToken());
    return tokenData.sub;
  }

  getExpirationDateFromToken(): Date {
    const tokenData: any = jwtDecode(this.getToken());
    return new Date(+tokenData.exp);
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
    this._local.removeItem('token');
  }
}

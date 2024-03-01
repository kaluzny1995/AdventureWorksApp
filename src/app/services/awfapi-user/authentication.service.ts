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

  /**
   * Authenticates user via API
  */
  authenticate(credentials: FormData): Observable<any> {
    return this._http.post<any>(this._appConfig.apiUrl + 'token', credentials);
  }

  /**
   * Sets user access token
  */
  setToken(token: string): void {
    this._local.setItem('token', token);
  }

  /**
   * Returns user access token from local storage memory
  */
  getToken(): string {
    return this._local.getItem('token') || '';
  }

  /**
   * Returns user username decoded from access token
  */
  getUsernameFromToken(): string {
    const tokenData: any = jwtDecode(this.getToken());
    return tokenData.sub;
  }

  /**
   * Returns token expiration date decoded from access token
  */
  getExpirationDateFromToken(): Date {
    const tokenData: any = jwtDecode(this.getToken());
    return new Date(+tokenData.exp * 1000);
  }

  /**
   * Checks whether current user is authenticated
  */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Checks via API current users authentication status
  */
  testAuthentication(): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + 'test');
  }

  /**
   * Verifies current users password via API
  */
  verifyPassword(password: string): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `verify/${password}`);
  }

  /**
   * Retuns from API current users details
  */
  getCurrentUser(): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + 'current_user');
  }

  /**
   * Removes user access token from local storage memory
   * @param [isPrefixesCleared] if true then removes also every entries stored during using admin pannels
  */
  removeToken(isPrefixesCleared: boolean = true): void {
    if (isPrefixesCleared) {
      const prefixes: string[] = this._appConfig.prefixes;
      for (const prefix of prefixes) {
        this._local.removeAllWithPrefix(prefix);
      }
    }

    this._local.removeItem('token');
  }
}

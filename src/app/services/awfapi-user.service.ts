import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AwfapiUserService {

  constructor(private _appConfig: AppConfigService, private _http: HttpClient) { }

  register(registeredUser: any): Observable<any> {
    return this._http.post<any>(this._appConfig.apiUrl + 'register_awfapi_user', registeredUser);
  }

  view(username: string): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `view_awfapi_user_profile/${username}`);
  }

  changeData(username: string, changedUserData: any): Observable<any> {
    return this._http.put<any>(this._appConfig.apiUrl + `change_awfapi_user_data/${username}`, changedUserData);
  }

  changeCredentials(username: string, changedUserCredentials: any): Observable<any> {
    return this._http.put<any>(this._appConfig.apiUrl + `change_awfapi_user_credentials/${username}`, changedUserCredentials);
  }

  removeAccount(username: string): Observable<any> {
    return this._http.delete<any>(this._appConfig.apiUrl + `remove_awfapi_user_account/${username}`);
  }
}

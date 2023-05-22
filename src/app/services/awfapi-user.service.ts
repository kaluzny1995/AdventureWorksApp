import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ViewedUser } from '../models/awfapi-user/viewed-user';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AwfapiUserService {

  constructor(private _appConfig: AppConfigService, private _auth: AuthenticationService, private _http: HttpClient) { }

  register() {

  }

  view(username: string) {
    return this._http.get<any>(this._appConfig.apiUrl + `view_awfapi_user_profile/${username}`);
  }

  changeData() {

  }

  changeCredentials() {

  }

  removeAccount() {

  }
}

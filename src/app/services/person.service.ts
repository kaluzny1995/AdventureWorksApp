import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { PersonDefaults } from '../models/admin-pannels/person-defaults';
import { Observable } from 'rxjs';
import { QueryParams } from '../models/query-params';
import { QueryParamsService } from './url/query-params.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(
    private _appConfig: AppConfigService,
    private _queryParams: QueryParamsService,
    private _http: HttpClient
    ) { }

  defaults(): PersonDefaults {
    return this._appConfig.personDefaults;
  }

  getPersons(queryParams: QueryParams): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `get_persons?${this._queryParams.apiOptParamString(queryParams)}`);
  }

  countPersons(filters: {[key: string]: string} | null): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `count_persons?${this._queryParams.apiOptFilterParam(filters)}`);
  }

  
}

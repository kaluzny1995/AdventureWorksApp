import { Injectable } from '@angular/core';
import { AppConfigService } from '../utils/app-config.service';
import { QueryParamsService } from '../url/query-params.service';
import { HttpClient } from '@angular/common/http';
import { PersonPhoneDefaults } from 'src/app/models/admin-pannels/person-phones/person-phone-defaults';
import { QueryParams } from 'src/app/models/admin-pannels/common/query-params';
import { PersonPhoneInput } from 'src/app/models/admin-pannels/person-phones/person-phone';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonPhoneService {

  constructor(
    private _appConfig: AppConfigService,
    private _queryParams: QueryParamsService,
    private _http: HttpClient
  ) { }

  defaults(): PersonPhoneDefaults {
    return this._appConfig.personPhoneDefaults;
  }

  getPersonPhones(queryParams: QueryParams): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `get_person_phones?${this._queryParams.apiOptParamString(queryParams)}`);
  }

  countPersonPhones(filters: {[key: string]: string} | null): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `count_person_phones?${this._queryParams.apiOptFilterParam(filters)}`);
  }

  getPersonPhone(personId: number, phoneNumber: string, phoneNumberTypeId: number): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `get_person_phone/${personId}/${phoneNumber}/${phoneNumberTypeId}`);
  }
  
  createPersonPhone(personPhone: PersonPhoneInput): Observable<any> {
    return this._http.post<any>(this._appConfig.apiUrl + 'create_person_phone', personPhone.toAPIStructure());
  }

  updatePersonPhone(personId: number, phoneNumber: string, phoneNumberTypeId: number, personPhone: PersonPhoneInput): Observable<any> {
    return this._http.put<any>(this._appConfig.apiUrl + `update_person_phone/${personId}/${phoneNumber}/${phoneNumberTypeId}`, personPhone.toAPIStructure());
  }

  deletePersonPhone(personId: number, phoneNumber: string, phoneNumberTypeId: number): Observable<any> {
    return this._http.delete<any>(this._appConfig.apiUrl + `delete_person_phone/${personId}/${phoneNumber}/${phoneNumberTypeId}`);
  }
}

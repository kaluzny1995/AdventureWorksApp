import { Injectable } from '@angular/core';
import { AppConfigService } from '../utils/app-config.service';
import { QueryParamsService } from '../url/query-params.service';
import { HttpClient } from '@angular/common/http';
import { PhoneNumberTypeDefaults } from 'src/app/models/admin-pannels/phone-number-types/phone-number-type-defaults';
import { QueryParams } from 'src/app/models/admin-pannels/common/query-params';
import { Observable } from 'rxjs';
import { PhoneNumberTypeInput } from 'src/app/models/admin-pannels/phone-number-types/phone-number-type';

@Injectable({
  providedIn: 'root'
})
export class PhoneNumberTypeService {

  constructor(
    private _appConfig: AppConfigService,
    private _queryParams: QueryParamsService,
    private _http: HttpClient
  ) { }

  defaults(): PhoneNumberTypeDefaults {
    return this._appConfig.phoneNumberTypeDefaults;
  }

  getPhoneNumberTypes(queryParams: QueryParams): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `get_phone_number_types?${this._queryParams.apiOptParamString(queryParams)}`);
  }

  countPhoneNumberTypes(filters: {[key: string]: string} | null): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `count_phone_number_types?${this._queryParams.apiOptFilterParam(filters)}`);
  }

  getPhoneNumberType(phoneNumberTypeId: number): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `get_phone_number_type/${phoneNumberTypeId}`);
  }
  
  createPhoneNumberType(phoneNumberType: PhoneNumberTypeInput): Observable<any> {
    return this._http.post<any>(this._appConfig.apiUrl + 'create_phone_number_type', phoneNumberType.toAPIStructure());
  }

  updatePhoneNumberType(phoneNumberTypeId: number, phoneNumberType: PhoneNumberTypeInput): Observable<any> {
    return this._http.put<any>(this._appConfig.apiUrl + `update_phone_number_type/${phoneNumberTypeId}`, phoneNumberType.toAPIStructure());
  }

  deletePhoneNumberType(phoneNumberTypeId: number): Observable<any> {
    return this._http.delete<any>(this._appConfig.apiUrl + `delete_phone_number_type/${phoneNumberTypeId}`);
  }

  allPhoneNumberTypes(): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `get_phone_number_types?limit=100`);
  }
}

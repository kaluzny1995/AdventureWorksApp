import { Injectable } from '@angular/core';
import { AppConfigService } from '../utils/app-config.service';
import { PersonDefaults } from '../../models/admin-pannels/persons/person-defaults';
import { Observable } from 'rxjs';
import { QueryParams } from '../../models/admin-pannels/common/query-params';
import { QueryParamsService } from '../url/query-params.service';
import { HttpClient } from '@angular/common/http';
import { PersonInput } from '../../models/admin-pannels/persons/person';

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

  getPerson(personId: number): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `get_person/${personId}`);
  }
  
  createPerson(person: PersonInput): Observable<any> {
    return this._http.post<any>(this._appConfig.apiUrl + 'create_person', person.toAPIStructure());
  }

  updatePerson(personId: number, person: PersonInput): Observable<any> {
    return this._http.put<any>(this._appConfig.apiUrl + `update_person/${personId}`, person.toAPIStructure());
  }

  deletePerson(personId: number): Observable<any> {
    return this._http.delete<any>(this._appConfig.apiUrl + `delete_person/${personId}`);
  }

  getFirst10Persons(): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `get_persons?limit=10`);
  }

  searchByPhrases(firstNamePhrase: string | null, lastNamePhrase: string | null, isOrdered: boolean | null): Observable<any> {
    return this._http.get<any>(this._appConfig.apiUrl + `search_by_phrases?first_name_phrase=${firstNamePhrase}&last_name_phrase=${lastNamePhrase}&is_ordered=${isOrdered}&is_alternative=true&is_raised_error_if_empty=false`);
  }
}

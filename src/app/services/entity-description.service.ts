import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityDescriptionService {

  constructor(private _http: HttpClient) { }

  loadEntityDescription(entity: string): Observable<any> {
    return this._http.get<any>(`/assets/data/entities/${entity}.json`);
  }
}

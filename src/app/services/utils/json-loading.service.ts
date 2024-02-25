import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonLoadingService {

  constructor(private _http: HttpClient) { }

  /**
   * Loads JSON files content with database entity description details
  */
  loadEntityDescription(entity: string): Observable<any> {
    return this._http.get<any>(`/assets/data/entities/${entity}.json`);
  }

  /**
   * Loads JSON files content with instruction details
  */
  loadInstruction(instruction: string): Observable<any> {
    return this._http.get<any>(`/assets/data/instructions/${instruction}.json`);
  }
}

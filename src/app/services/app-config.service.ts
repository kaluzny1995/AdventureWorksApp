import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryParams } from '../models/query-params';
import { PersonDefaults } from '../models/admin-pannels/person-defaults';
import { ViewParams } from '../models/view-params';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private _appConfig: any;

  constructor(private _http: HttpClient) { }

  loadAppConfig(): Promise<any> {
    return this._http.get('/assets/config.json')
      .toPromise().then(data => {
        console.log('Config file loaded', data);
        this._appConfig = data;
      }).catch(error => {
        console.error('Error while loading config file', error);
      });
  }

  /*App configs*/
  get title(): string {
    return this._appConfig.app.title;
  }
  get shortTitle(): string {
    return this._appConfig.app.shortTitle;
  }
  get description(): string {
    return this._appConfig.app.description;
  }
  get author(): any {
    return this._appConfig.app.author;
  }
  get emailUrl(): string {
    const email: string = this._appConfig.app.author.email.address;
    const subject: string = this._appConfig.app.author.email.to.subject;
    const body: string = this._appConfig.app.author.email.to.body;

    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  /*API configs*/
  get apiUrl(): string {
    const host: string = this._appConfig.api.host;
    const port: number = this._appConfig.api.port;

    return `http://${host}:${port}/`;
  }
  get authRequiredEndpoints(): string[] {
    return this._appConfig.api.authRequiredEndpoints;
  }
  get forbiddenUsernames(): string[] {
    return this._appConfig.api.forbiddenUsernames;
  }

  /*Query parameters config*/
  get defaultQueryParams(): QueryParams {
    return new QueryParams(this._appConfig.defaults.queryParams.page,
                           this._appConfig.defaults.queryParams.perPage,
                           this._appConfig.defaults.queryParams.filters,
                           this._appConfig.defaults.queryParams.orderBy,
                           this._appConfig.defaults.queryParams.type)
  }

  /* View params config */
  get defaultViewParams(): ViewParams {
    return new ViewParams(this._appConfig.defaults.view.isColumnSetOn,
                          this._appConfig.defaults.view.isFilterSetOn,
                          this._appConfig.defaults.view.perPageOptions,
                          this._appConfig.defaults.view.selectedId,
                          this._appConfig.defaults.view.newId,
                          this._appConfig.defaults.view.changedId,)
  }

  /*Person defaults config*/
  get personDefaults(): PersonDefaults {
    return new PersonDefaults(this._appConfig.defaults.person.availableColumns,
                              this._appConfig.defaults.person.availableColumnNames,
                              this._appConfig.defaults.person.displayedIndices,
                              this._appConfig.defaults.person.availableFilters,
                              this._appConfig.defaults.person.availableFilterNames,
                              this._appConfig.defaults.person.types)
  }
}

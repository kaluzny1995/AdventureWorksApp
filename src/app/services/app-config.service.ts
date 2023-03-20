import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private _appConfig: any;

  constructor(private _http: HttpClient) { }

  loadAppConfig() {
    return this._http.get('/assets/config.json')
      .toPromise().then(data => {
        console.log('Config file loaded', data);
        this._appConfig = data;
      }).catch(error => {
        console.error('Error while loading config file', error);
      });
  }

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
    let email: string = this._appConfig.app.author.email.address;
    let subject: string = this._appConfig.app.author.email.to.subject;
    let body: string = this._appConfig.app.author.email.to.body;

    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  get apiUrl(): string {
    let host: string = this._appConfig.api.host;
    let port: number = this._appConfig.api.port;

    return `http://${host}:${port}/`;
  }

  get authRequiredEndpoints(): string[] {
    return this._appConfig.api.authRequiredEndpoints;
  }
}

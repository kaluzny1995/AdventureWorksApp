import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getUrlBase(urlString: string): string {
    let urlBase: string = decodeURIComponent(urlString);
    if (urlBase.indexOf(';') > -1) {
      urlBase = urlBase.split(';')[0];
    }
    return urlBase;
  }

  getUrlOptionalParams(urlString: string): any {
    let paramString: string = decodeURIComponent(urlString);
    if (paramString.indexOf(';') > -1) {
      paramString = paramString.split(';')[1];
      if (!paramString) {
        return {};
      }
    } else {
      return {};
    }
    paramString = paramString.replace(/&/g, '","').replace(/=/g,'":"');
    let params: any = JSON.parse(`{"${paramString}"}`, function(key, value) { return value });
    return params;
  }
}

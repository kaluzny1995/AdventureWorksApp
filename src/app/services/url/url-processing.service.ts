import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlProcessingService {

  constructor() { }

  /**
   * Returns the base path string of URL address
   * @example 'some/thing/1;status=signed_in' => 'some/thing/1'
  */
  base(urlString: string): string {
    const urlBase: string = decodeURIComponent(urlString);
    if (urlBase.indexOf(';') > -1) {
      return urlBase.split(';')[0];
    }
    return urlBase;
  }

  /**
   * Returns the optional parameters string of URL address
   * @example 'some/thing/1;status=signed_in' => 'status=signed_in'
  */
  optParamString(urlString: string): string {
    const paramString: string = decodeURIComponent(urlString);
    if (paramString.indexOf(';') > -1) {
      return paramString.split(';').slice(1).join(';');
    }
    return '';
  }

  /**
   * Returns the optional parameters dictionary of URL address
   * @example 'some/thing/1;status=signed_in' => {status: 'signed_in'}
  */
  optParams(urlString: string): {[key: string]: string} {
    const paramString = this.optParamString(urlString);
    
    if (paramString !== '') {
      let paramDict: {[key: string]: string} = {};
      for (const ps of paramString.split(';')) {
        const pv: string[] = ps.split('=');
        paramDict[pv[0]] = pv[1];
      }
      return paramDict;
    }
    return {};
  }
}

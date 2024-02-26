import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlProcessingService {

  constructor() { }

  /**
   * Returns decoded URL string
  */
  decode(urlString: string): string {
    return decodeURIComponent(urlString);
  }

  /**
   * Returns encoded URL string
  */
  encode(urlString: string): string {
    return encodeURIComponent(urlString);
  }

  /**
   * Returns partially encoded URL string only from between square brackets (decoded URLs only)
  */
  encodePart(urlString: string): string {
    const regexp: RegExp = /\[(.*)\]/;
    const occurrences: RegExpMatchArray | null  = urlString.match(regexp);
    if (occurrences !== null) {
      const occurrence: string  = encodeURIComponent(this.bracket(occurrences[1]));
      return urlString.replace(regexp, occurrence)
    }
    return urlString;
  }

  /**
   * Returns the URL address surrounded by square brackets
  */
  bracket(urlString: string): string {
    return `[${urlString}]`;
  }

  /**
   * Returns the URL address without surrounding square brackets (decoded URLs only)
  */
  unbracket(urlString: string): string {
    return urlString.substring(1, urlString.length - 1);
  }

  /**
   * Returns the base path string of URL address (decoded URLs only)
   * @example 'some/thing/1;status=signed_in' => 'some/thing/1'
  */
  base(urlString: string): string {
    if (urlString.indexOf(';') > -1) {
      return urlString.split(';')[0];
    }
    return urlString;
  }

  /**
   * Returns the optional parameters string of URL address (decoded URLs only)
   * @example 'some/thing/1;status=signed_in' => 'status=signed_in'
  */
  optParamString(urlString: string): string {
    if (urlString.indexOf(';') > -1) {
      return urlString.split(';').slice(1).join(';');
    }
    return '';
  }

  /**
   * Returns the optional parameters dictionary of URL address (decoded URLs only)
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

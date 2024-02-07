import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Returns a dictionary based on two arrays, first of which are keys and second - values
  */
  dictFromArrays(keys: string[], values: any[]): {[key: string]: any} {
    let dict: {[key: string]: any} = {};

    if (keys.length !== values.length) {
      throw new EvalError(`Keys and values array length are different: ${keys.length}!==${values.length}`);
    }

    for (let i=0; i<keys.length; i++) {
      dict[keys[i]] = values[i];
    }

    return dict;
  }
}

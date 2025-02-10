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

  /**
   * Prepends an item into array, inserts item at the arrays beginning
  */
  prepend<T>(item: T, array: T[]): T[] {
    let copy = array.slice();
    copy.unshift(item);
    return copy;
  }

  /**
   * Extracts id from primary key constrain violation message
  */
  getIdFromPKViolationMessage(message: string): string | null {
    const occurrences: RegExpExecArray | null = /\(([^)]*)\)/.exec(message);
    return occurrences !== null? occurrences[1] : null;
  }

  /**
   * Extracts id and entity name from foreign key constraint violation message
  */
  getIdFromFKViolationString(message: string): string | null {
    const occurrences: RegExpExecArray | null = /\(([^)]*)\)/.exec(message);
    return occurrences !== null? occurrences[2] : null;
  }
}

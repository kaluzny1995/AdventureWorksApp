import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterParamsService {

  constructor() { }

  /**
   * Returns a string of filter parameters from filters list (name, value)
   * @example {person_type: 'GC', first_name_phrase: 'jak'} => 'person_type:GC,first_name_phrase:jak'
  */
  filterString(filterParams: {[key: string]: string} | null): string {
    return !filterParams? '' : Object.entries(filterParams).map(([k, v]) => `${k}:${v}`).join(',');
  }

  /**
   * Returns a filters list (name, value) from filter string
   * @example 'person_type:GC,first_name_phrase:jak' => {person_type: 'GC', first_name_phrase: 'jak'}
  */
  fromFilterString(filterString: string): {[key: string]: string} | null {
    return filterString === ''? null : Object.assign({}, ...decodeURIComponent(filterString).split(',').map(k => k.split(':')).map(k => ({[k[0]]: k[1]})));
  }

  /**
   * Returns a filters dictionary with keys converted from snake_case to CamelCase naming convention
   * @example {person_type: 'GC', last_name_phrase: 'aw'} => {personType: 'GC', lastNamePhrase: 'aw'}
  */
  camelCase(filterParams: {[key: string]: string} | null): {[key: string]: string} | null {
    if (filterParams !== null) {
      let camelCaseParams: {[key: string]: string} = {};
      for (const k in filterParams) {
        const param: string = k.replace(/([-_][a-z])/g, group => group[1].toUpperCase());
        camelCaseParams[param] = filterParams[k];
      }
      return camelCaseParams;
    }
    return null;
  }

  /**
   * Returns a filters dictionary with keys converted from camelCase to snake_case naming convention
   * @example {personType: 'GC', lastNamePhrase: 'aw'} => {person_type: 'GC', last_name_phrase: 'aw'}
  */
  snakeCase(filterParams: {[key: string]: string} | null): {[key: string]: string} | null {
    if (filterParams !== null) {
      let snakeCaseParams: {[key: string]: string} = {};
      for (const k in filterParams) {
        const param: string = k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        snakeCaseParams[param] = filterParams[k];
      }
      return snakeCaseParams;
    }
    return null;
  }

  /**
   * Returns a list of filter names passed through URL filter string
   * @example 'person_type:GC,first_name_phrase:jak' => ['person_type', 'first_name_phrase']
  */
  names(filterString: string): string[] {
    return filterString === ''? [] : filterString.split(',').map(k => k.split(':')[0]);
  }

  /**
   * Returns minimized filter parameters dictionary ie. such without null, empty or undefined values
   * @example {person_type: 'GC', last_name_phrase: null, first_name_phrase: '', personIds: '[]'} => {person_type: 'GC'}
  */
  minimized(filterParams: {[key: string]: string} | null): {[key: string]: string} | null {
    if (filterParams === null) {
      return null;
    } else if (Object.values(filterParams).every(v => v === null || v === undefined || v === '' || v === '[]')) {
      return null;
    } else {
      return Object.assign({}, ...Object.entries(filterParams)
                                        .filter(([_, v]) => (!['', '[]', null, undefined].includes(v)))
                                        .map(([k, v]) => ({[k]: v})));
    }
  }
}

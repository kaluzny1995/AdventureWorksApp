import { Injectable } from '@angular/core';
import { QueryParams } from 'src/app/models/query-params';
import { AppConfigService } from '../app-config.service';
import { EOrderType } from 'src/app/models/e-order-type';
import { UrlProcessingService } from './url-processing.service';
import { FilterNameError, FilterValueError, OptionalParamError } from 'src/app/app.errors';
import { FilterParamsService } from './filter-params.service';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsService {

  constructor(
    private _appConfig: AppConfigService,
    private _urlProc: UrlProcessingService,
    private _filterParam: FilterParamsService
  ) { }

  /**
   * Returns QueryParams object with default values from config
  */
  defaults(): QueryParams {
    return this._appConfig.defaultQueryParams;
  }

  /**
   * Returns optional parameter string from QueryParams object
  */
  optParamString(params: QueryParams): string {
    const defaultQP: QueryParams = this._appConfig.defaultQueryParams;
    let strings: string[] = [];
    if (params.page != defaultQP.page) {
      strings.push(`page=${params.page}`);
    }
    if (params.perPage != defaultQP.perPage) {
      strings.push(`perPage=${params.perPage}`);
    }
    if (params.filters != defaultQP.filters) {
      const filterString: string = this._filterParam.filterString(params.filters);
      strings.push(`filters=${filterString}`);
    }
    if (params.orderBy != defaultQP.orderBy) {
      strings.push(`orderBy=${params.orderBy}`);
    }
    if (params.type != defaultQP.type) {
      strings.push(`type=${params.type}`);
    }

    return strings.join('&');
  }

  /**
   * Returns the optional parameters dictionary with only these parameters whose values are different from defaults
  */
  necessaryOptParams(params: QueryParams): {[key: string]: any} {
    const defaultQP: QueryParams = this._appConfig.defaultQueryParams;
    let paramsDict: {[key: string]: any} = {};
    if (params.page != defaultQP.page) {
      paramsDict['page'] = params.page;
    }
    if (params.perPage != defaultQP.perPage) {
      paramsDict['perPage'] = params.perPage;
    }
    if (params.filters != defaultQP.filters) {
      const filterString: string = this._filterParam.filterString(params.filters);
      paramsDict['filters'] = filterString;
    }
    if (params.orderBy != defaultQP.orderBy) {
      paramsDict['orderBy'] = params.orderBy;
    }
    if (params.type != defaultQP.type) {
      paramsDict['type'] = params.type;
    }
    
    return paramsDict;
  }

  /**
   * Returns QueryParams object based of given optional parameters string
  */
  fromOptParamString(urlString: string, availableFilters?: string[]): QueryParams {
    const defaultQP: QueryParams = this._appConfig.defaultQueryParams;
    let page: number = defaultQP.page;
    let perPage: number = defaultQP.perPage;
    let filters: {[key: string]: string} | null = defaultQP.filters;
    let orderBy: string | null = defaultQP.orderBy;
    let type: EOrderType = defaultQP.type;

    const strings: string[] = this._urlProc.optParamString(urlString).split(';');
    if (strings[0] === '') {
      return new QueryParams(page, perPage, filters, orderBy, type);
    }
    
    for (const s of strings) {
      const kv: string[] = s.split('=');
      switch (kv[0]) {
        case 'page':
          page = +kv[1];
          break;
        case 'perPage':
          perPage = +kv[1];
          break;
        case 'filters':
          if (typeof availableFilters !== 'undefined') {
            for (const fp of this._filterParam.names(kv[1])) {
              if (availableFilters.indexOf(fp) === -1) {
                console.error(`Unknown filter parameter '${fp}' in filter string.`);
                throw new FilterNameError(`Unknown filter parameter '${fp}' in filter string.`);
              }
            }
          }
          filters = this._filterParam.fromFilterString(kv[1]);
          break;
        case 'orderBy':
          orderBy = kv[1] === ''? null : kv[1];
          break;
        case 'type':
          type = EOrderType[kv[1].toUpperCase() as keyof typeof EOrderType]
          if (type === undefined) {
            console.error(`Unknown order type: '${kv[1]}'.`);
            throw new FilterValueError(`Unknown order type: '${kv[1]}'.`);
          }
          break;
        case 'status': case 'displayedCols': case 'colSet': case 'filSet': case 'selId': case 'newId': case 'chId':
          break;
        default:
          console.error(`Unknown optional parameter '${kv[0]}' in URL string.`);
          throw new OptionalParamError(`Unknown optional parameter '${kv[0]}' in URL string.`);
      }
    }

    return new QueryParams(page, perPage, filters, orderBy, type);
  }

  /**
   * Returns camelCase string converted from snake_case
  */
  camelCase(value: string | null): string | null {
    if (value !== null) {
      return value.replace(/([-_][a-z])/g, group => group[1].toUpperCase());
    }
    return null;
  }

  /**
   * Returns snake_case string converted from camelCase
  */
  snakeCase(value: string | null): string | null {
    if (value !== null) {
      return value.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    }
    return null;
  }

  /**
   * Returns optional parameters string used in API endpoint (for objects searching)
  */
  apiOptParamString(params: QueryParams): string {
    const defaultQP: QueryParams = this._appConfig.defaultQueryParams;
    let strings: string[] = [];
    if (params.filters != defaultQP.filters) {
      const filterString: string = this._filterParam.filterString(this._filterParam.snakeCase(params.filters));
      strings.push(`filters=${filterString}`);
    }
    if (params.orderBy != defaultQP.orderBy) {
      const orderHeader: string = this.snakeCase(params.orderBy) || '';
      strings.push(`order_by=${orderHeader}`);
    }
    if (params.type != defaultQP.type) {
      strings.push(`order_type=${params.type}`);
    }
    if (params.page != defaultQP.page) {
      strings.push(`offset=${(params.page - 1) * params.perPage}`);
    }
    if (params.perPage != defaultQP.perPage) {
      strings.push(`limit=${params.perPage}`);
    }

    return strings.join('&');
  }

  /**
   * Returns optional filter parameter used in API endpoint (for objects counting)
  */
  apiOptFilterParam(filters: {[key: string]: string} | null): string {
    if (filters !== null) {
      const filterString: string = this._filterParam.filterString(this._filterParam.snakeCase(filters));
      return `filters=${filterString}`;
    }
    return '';
  }
}

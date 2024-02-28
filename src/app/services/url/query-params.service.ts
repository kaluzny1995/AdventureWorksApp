import { Injectable } from '@angular/core';
import { QueryParams } from 'src/app/models/admin-pannels/common/query-params';
import { AppConfigService } from '../utils/app-config.service';
import { EOrderType } from 'src/app/models/admin-pannels/common/e-order-type';
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
   * Returns QueryParams object based of given optional parameters string
  */
  fromOptParamString(urlString: string, availableFilters?: string[]): QueryParams {
    const defaultQP: QueryParams = this._appConfig.defaultQueryParams;
    let page: number = defaultQP.page;
    let perPage: number = defaultQP.perPage;
    let filters: {[key: string]: string} | null = defaultQP.filters;
    let orderBy: string | null = defaultQP.orderBy;
    let type: EOrderType = defaultQP.type;

    const dict: {[key: string]: string} = this._urlProc.optParams(urlString);
    if (Object.keys(dict).length === 0) {
      return new QueryParams(page, perPage, filters, orderBy, type);
    }
    
    for (const k in dict) {
      const v: string = dict[k];
      switch (k) {
        case 'page':
          page = +v;
          break;
        case 'perPage':
          perPage = +v;
          break;
        case 'filters':
          if (typeof availableFilters !== 'undefined') {
            for (const fp of this._filterParam.names(v)) {
              if (availableFilters.indexOf(fp) === -1) {
                console.error(`Unknown filter parameter '${fp}' in filter string.`);
                throw new FilterNameError(`Unknown filter parameter '${fp}' in filter string.`);
              }
            }
          }
          filters = this._filterParam.fromFilterString(v);
          break;
        case 'orderBy':
          orderBy = v === ''? null : v;
          break;
        case 'type':
          type = EOrderType[v.toUpperCase() as keyof typeof EOrderType]
          if (type === undefined) {
            console.error(`Unknown order type: '${v}'.`);
            throw new FilterValueError(`Unknown order type: '${v}'.`);
          }
          break;
        case 'status':
          break;
        default:
          console.error(`Unknown optional parameter '${k}' in URL string.`);
          throw new OptionalParamError(`Unknown optional parameter '${k}' in URL string.`);
      }
    }

    return new QueryParams(page, perPage, filters, orderBy, type);
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

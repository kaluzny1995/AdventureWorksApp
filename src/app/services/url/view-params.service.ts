import { Injectable } from '@angular/core';
import { ViewParams } from 'src/app/models/admin-pannels/common/view-params';
import { AppConfigService } from '../utils/app-config.service';
import { UrlProcessingService } from './url-processing.service';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ViewParamsService {

  constructor(
    private _appConfig: AppConfigService,
    private _urlProc: UrlProcessingService,
    private _local: LocalStorageService
    ) { }

  /**
   * Returns ViewParams object with default values from config
  */
  defaults(): ViewParams {
    return this._appConfig.defaultViewParams;
  }

  /**
   * Returns specific view values from optional parameters from URL string or default values if not provided
  */
  fromOptParamString(urlString: string): ViewParams {
    const optParams: {[key: string]: string} = this._urlProc.optParams(urlString);
    return this._viewValues(optParams);
  }

  /**
   * Returns specific view values from optional parameters from local storage memory or default values if not provided
  */
  fromLocalStorage(prefix: string): ViewParams {
    const lsParams: {[key: string]: string} = this._local.getAllWithPrefix(prefix);
    return this._viewValues(lsParams, prefix);
  }

  /**
   * Returns view values from local storage or URL string or sets default value if some not provided
  */
  private _viewValues(dict: {[key: string]: string}, prefix?: string): ViewParams {
    const pre: string = prefix !== undefined ? `${prefix}-` : '';
    const vP: ViewParams = this.defaults();
    let colSet: boolean = vP.isColumnSetOn;
    let filSet: boolean = vP.isFilterSetOn;
    let selId: string | null = vP.selectedId;
    let newId: string | null = vP.newId;
    let chId: string | null = vP.changedId;

    if (dict[`${pre}colSet`] !== undefined && Boolean(dict[`${pre}colSet`]) !== vP.isColumnSetOn) {
      colSet = Boolean(dict[`${pre}colSet`]);
    }
    if (dict[`${pre}filSet`] !== undefined && Boolean(dict[`${pre}filSet`]) !== vP.isFilterSetOn) {
      filSet = Boolean(dict[`${pre}filSet`]);
    }
    // perPageOptions not displayed in URL string
    if (dict[`${pre}selId`] !== undefined && dict[`${pre}selId`] !== vP.selectedId) {
      selId = dict[`${pre}selId`];
    }
    if (dict[`${pre}newId`] !== undefined && dict[`${pre}newId`] !== vP.newId) {
      newId = dict[`${pre}newId`];
    }
    if (dict[`${pre}chId`] !== undefined && dict[`${pre}chId`] !== vP.changedId) {
      chId = dict[`${pre}chId`];
    }

    return new ViewParams(colSet, filSet, vP.perPageOptions, selId, newId, chId);
  }

  /**
   * Returns the all optional parameters dictionary
  */
  allOptParams(viewParams: ViewParams): {[key: string]: any} {
    const params: {[key: string]: any} = {
      colSet: viewParams.isColumnSetOn,
      filSet: viewParams.isFilterSetOn,
      selId: viewParams.selectedId,
      newId: viewParams.newId,
      chId: viewParams.changedId
    };
    return params;
  }

  /**
   * Returns the optional parameters dictionary with only these parameters whose values are different from defaults
  */
  necessaryOptParams(viewParams: ViewParams): {[key: string]: any} {
    const vP: ViewParams = this.defaults();
    let params: {[key: string]: any} = {};

    if (viewParams.isColumnSetOn !== vP.isColumnSetOn) {
      params['colSet'] = viewParams.isColumnSetOn;
    }
    if (viewParams.isFilterSetOn !== vP.isFilterSetOn) {
      params['filSet'] = viewParams.isFilterSetOn;
    }
    // perPageOptions not displayed in URL string
    if (viewParams.selectedId !== vP.selectedId) {
      params['selId'] = viewParams.selectedId;
    }
    if (viewParams.newId !== vP.newId) {
      params['newId'] = viewParams.newId;
    }
    if (viewParams.changedId !== vP.changedId) {
      params['chId'] = viewParams.changedId;
    }

    return params;
  }

  /**
   * Stores the view parameters in local storage memory
   * @param isCleared: if true then all entries starting with @param prefix are removed
  */
  toLocalStorage(viewParams: ViewParams, prefix: string, isCleared: boolean): void {
    const dict: {[key: string]: any} = this.necessaryOptParams(viewParams);
    this._local.setAllWithPrefix(dict, prefix, isCleared);
  }

  /**
   * Converts string parameter value to number
   * Applicable for: persons, phone number types
  */
  str2Num(param: string | null): number {
    return param !== null? +param : -1;
  }

  /**
   * Converts number parameter value to string
   * Applicable for: persons, phone number types
  */
  num2Str(param: number): string {
    return String(param);
  }

  /**
   * Converts string parameter value to [number, string, number] tuple
   * Applicable for: person phones
  */
  str2NSNTuple(param: string | null, separator: string): [number, string, number] {
    const params: string[] = param !== null? param.split(separator) : ['-1', ' ', '-1'];
    return [+params[0], params[1], +params[2]];
  }

  /**
   * Converts [number, string, number] tuple parameter value to string
   * Applicable for: person phones
  */
  nsnTuple2Str(param: [number, string, number], separator: string): string {
    return `${param[0]}${separator}${param[1]}${separator}${param[2]}`;
  }
}

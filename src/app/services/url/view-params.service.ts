import { Injectable } from '@angular/core';
import { ViewParams } from 'src/app/models/view-params';
import { AppConfigService } from '../app-config.service';
import { UrlProcessingService } from './url-processing.service';

@Injectable({
  providedIn: 'root'
})
export class ViewParamsService {

  constructor(
    private _appConfig: AppConfigService,
    private _urlProc: UrlProcessingService
    ) { }

  /**
   * Returns ViewParams object with default values from config
  */
  defaults(): ViewParams {
    return this._appConfig.defaultViewParams;
  }

  /**
   * Returns specific view values from optional params from URL string or default values if not provided
  */
  fromOptParamString(urlString: string): ViewParams {
    const optParams: {[key: string]: string} = this._urlProc.optParams(urlString);
    const vP = this.defaults();
    let colSet: boolean = vP.isColumnSetOn;
    let filSet: boolean = vP.isFilterSetOn;
    let selId: number | null = vP.selectedId;
    let newId: number | null = vP.newId;
    let chId: number | null = vP.changedId;

    if (optParams['colSet'] !== undefined && Boolean(optParams['colSet']) !== vP.isColumnSetOn) {
      colSet = Boolean(optParams['colSet']);
    }
    if (optParams['filSet'] !== undefined && Boolean(optParams['filSet']) !== vP.isFilterSetOn) {
      filSet = Boolean(optParams['filSet']);
    }
    // perPageOptions not displayed in URL string
    if (optParams['selId'] !== undefined && +optParams['selId'] !== vP.selectedId) {
      selId = +optParams['selId'];
    }
    if (optParams['newId'] !== undefined && +optParams['newId'] !== vP.newId) {
      newId = +optParams['newId'];
    }
    if (optParams['chId'] !== undefined && +optParams['chId'] !== vP.changedId) {
      chId = +optParams['chId'];
    }

    return new ViewParams(colSet, filSet, vP.perPageOptions, selId, newId, chId);
  }

  /**
   * Returns the optional parameters dictionary with only these parameters whose values are different from defaults
  */
  necessaryOptParams(viewParams: ViewParams): {[key: string]: any} {
    const vP = this.defaults();
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
}

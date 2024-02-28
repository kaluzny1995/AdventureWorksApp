import { Injectable } from '@angular/core';
import { UrlProcessingService } from './url-processing.service';
import { ColumnNotFoundError } from 'src/app/app.errors';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ColumnDisplayingService {

  constructor(
    private _urlProc: UrlProcessingService,
    private _local: LocalStorageService
    ) { }

  /**
   * Returns indices of displayed columns from optional params from URL string or default value if not provided
  */
  fromOptParamString(urlString: string, defaultIndices: number[]): number[] {
    const optParams: {[key: string]: string} = this._urlProc.optParams(urlString);
    return this._indices(optParams, defaultIndices);
  }

  /**
   * Returns indices of displayed columns from optional params from local storage memory or default value if not provided
  */
  fromLocalStorage(prefix: string, defaultIndices: number[]): number[] {
    const lsParams: {[key: string]: string} = this._local.getAllWithPrefix(prefix);
    return this._indices(lsParams, defaultIndices, prefix);
  }

  /**
   * Returns indices of displayed columns from local storage or URL string or sets default value if some not provided
  */
  private _indices(dict: {[key: string]: string}, defaultIndices: number[], prefix?: string): number[] {
    const pre: string = prefix !== undefined ? `${prefix}-` : '';
    if (dict[`${pre}displayedCols`] !== undefined) {
      return dict[`${pre}displayedCols`].split(',').map((i: string) => +i);
    }
    return defaultIndices;
  }

  /**
   * Returns displayed column names with provided indices and available column names list
  */
  displayedColumns(indices: number[], availableColumns: string[]): string[] {
    for (const i of indices) {
      if (i >= availableColumns.length) {
        console.error(`Column of given index '${i}' not found.`);
        throw new ColumnNotFoundError(`Column of given index '${i}' not found.`);
      }
    }
    return indices.map((i: number) => availableColumns[i]);
  }

  /**
   * Returns a dictionary with a parameter containing displayed column indices
  */
  optParam(displayedColumns: string[], availableColumns: string[]): {[key: string]: any} {
    const displayedIndices: number[] = displayedColumns.map((dc: string) => availableColumns.indexOf(dc));
    return {displayedCols: displayedIndices.join(',')};
  }

  /**
   * Returns a dictionary with a parameter containing displayed column indices or empty if overlaps with default indices
  */
  necessaryOptParam(displayedColumns: string[], availableColumns: string[], defaultIndices: number[]): {[key: string]: any} {
    const displayedIndices: number[] = displayedColumns.map((dc: string) => availableColumns.indexOf(dc));
    if (displayedIndices.length !== defaultIndices.length || !displayedIndices.every((v: number, i: number) => v === defaultIndices[i])) {
      return {displayedCols: displayedIndices.join(',')};
    }
    return {};
  }

  /**
   * Stores the displayed column indices parameter in local storage memory
   * @param isCleared: if true then all entries starting with @param prefix are removed
  */
  toLocalStorage(displayedColumns: string[], availableColumns: string[], defaultIndices: number[], prefix: string, isCleared: boolean): void {
    const dict: {[key: string]: any} = this.necessaryOptParam(displayedColumns, availableColumns, defaultIndices);
    this._local.setAllWithPrefix(dict, prefix, isCleared);
  }
}

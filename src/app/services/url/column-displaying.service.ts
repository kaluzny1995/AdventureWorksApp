import { Injectable } from '@angular/core';
import { UrlProcessingService } from './url-processing.service';
import { ColumnNotFoundError } from 'src/app/app.errors';

@Injectable({
  providedIn: 'root'
})
export class ColumnDisplayingService {

  constructor(private _urlProc: UrlProcessingService) { }

  /**
   * Returns indices of displayed columns from optional params from URL string or default value if not provided
  */
  fromOptParamString(urlString: string, defaultIndices: number[]): number[] {
    const optParams: {[key: string]: string} = this._urlProc.optParams(urlString);
    if (optParams['displayedCols'] !== undefined) {
      return optParams['displayedCols'].split(',').map((i: string) => +i);
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
   * Returns a dictionary with a parameter containing displayed column indices or empty if overlaps with default indices
  */
  necessaryOptParam(displayedColumns: string[], availableColumns: string[], defaultIndices: number[]): {[key: string]: any} {
    const displayedIndices: number[] = displayedColumns.map((dc: string) => availableColumns.indexOf(dc));
    if (displayedIndices.length !== defaultIndices.length || !displayedIndices.every((v: number, i: number) => v === defaultIndices[i])) {
      return {displayedCols: displayedIndices.join(',')};
    }
    return {};
  }
}

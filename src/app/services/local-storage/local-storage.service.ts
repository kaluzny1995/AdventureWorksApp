import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Returns entry value found by given key or null if not found
  */
  getItem(key: string, prefix?: string): string | null {
    if (prefix) {
      return localStorage.getItem(`${prefix}-${key}`);
    } else {
      return localStorage.getItem(key);
    }
  }

  /**
   * Sets entry value found by given key or does nothing if not found
  */
  setItem(key: string, value: string, prefix?: string): void {
    if (prefix) {
      localStorage.setItem(`${prefix}-${key}`, value);
    } else {
      localStorage.setItem(key, value);
    }
  }

  /**
   * Removes entry found by given key or does nothing if not found
  */
  removeItem(key: string, prefix?: string): void {
    if (prefix) {
      localStorage.removeItem(`${prefix}-${key}`);
    } else {
      localStorage.removeItem(key);
    }
  }

  /**
   * Returns all entries dictionary which keys start with given prefix
  */
  getAllWithPrefix(prefix: string): {[key: string]: string} {
    const keys: (string | null)[] = this._keysWithPrefix(prefix);
    return Object.assign({}, ...keys.map(k => ({[`${k}`]: this.getItem(`${k}`)})));
  }

  /**
   * Sets all entry values which keys start with given prefix,
   * @param isCleared: if true then all entries starting with @param prefix are removed
  */
  setAllWithPrefix(entries: {[key: string]: string}, prefix: string, isCleared: boolean): void {
    if (isCleared) {
      this.removeAllWithPrefix(prefix);
    }
    for (const entryKey in entries) {
      this.setItem(entryKey, entries[entryKey], prefix);
    }
  }

  /**
   * Removes all entries which keys start with given prefix
  */
  removeAllWithPrefix(prefix: string): void {
    const keys: (string | null)[] = this._keysWithPrefix(prefix);
    for (const key of keys.map(k => `${k}`)) {
      this.removeItem(key);
    }
  }

  /**
   * Returns all keys which start with given prefix
  */
  private _keysWithPrefix(prefix: string): (string | null)[] {
    return Array.from(Array(localStorage.length).keys())
                .map(k => localStorage.key(k))
                .filter(k => k?.startsWith(prefix));
  }
}

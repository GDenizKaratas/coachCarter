import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly STORAGE_PREFIX = 'coaching_tracker_';

  set<T>(key: string, value: T): void {
    localStorage.setItem(`${this.STORAGE_PREFIX}${key}`, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const item = localStorage.getItem(`${this.STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  }

  remove(key: string): void {
    localStorage.removeItem(`${this.STORAGE_PREFIX}${key}`);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  }
}

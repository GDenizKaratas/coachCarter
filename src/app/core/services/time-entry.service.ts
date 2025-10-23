import { Injectable, signal, computed, inject } from '@angular/core';
import { TimeEntry } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class TimeEntryService {
  private storageService = inject(StorageService);
  private readonly STORAGE_KEY = 'time_entries';

  private timeEntriesSignal = signal<TimeEntry[]>([]);

  timeEntries = this.timeEntriesSignal.asReadonly();

  constructor() {
    this.loadTimeEntries();
  }

  private loadTimeEntries(): void {
    const stored = this.storageService.get<TimeEntry[]>(this.STORAGE_KEY);
    this.timeEntriesSignal.set(stored || []);
  }

  private saveTimeEntries(): void {
    this.storageService.set(this.STORAGE_KEY, this.timeEntriesSignal());
  }

  add(entry: Omit<TimeEntry, 'id'>): TimeEntry {
    const newEntry: TimeEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };

    this.timeEntriesSignal.update((entries) => [...entries, newEntry]);
    this.saveTimeEntries();
    return newEntry;
  }

  update(id: string, updates: Partial<Omit<TimeEntry, 'id'>>): boolean {
    const entry = this.getById(id);
    if (!entry) return false;

    const updatedEntry = { ...entry, ...updates };
    this.timeEntriesSignal.update((entries) =>
      entries.map((e) => (e.id === id ? updatedEntry : e))
    );
    this.saveTimeEntries();
    return true;
  }

  delete(id: string): boolean {
    const entry = this.getById(id);
    if (!entry) return false;

    this.timeEntriesSignal.update((entries) => entries.filter((e) => e.id !== id));
    this.saveTimeEntries();
    return true;
  }

  getById(id: string): TimeEntry | undefined {
    return this.timeEntriesSignal().find((entry) => entry.id === id);
  }

  getByDate(date: string): TimeEntry[] {
    return this.timeEntriesSignal().filter((entry) => entry.date === date);
  }

  getByDateRange(startDate: string, endDate: string): TimeEntry[] {
    return this.timeEntriesSignal().filter(
      (entry) => entry.date >= startDate && entry.date <= endDate
    );
  }

  getByCategory(categoryId: string): TimeEntry[] {
    return this.timeEntriesSignal().filter((entry) => entry.categoryId === categoryId);
  }

  getByGoal(goalId: string): TimeEntry[] {
    return this.timeEntriesSignal().filter((entry) => entry.goalId === goalId);
  }

  todayEntries = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.getByDate(today);
  });

  getTotalMinutesByDate(date: string): number {
    return this.getByDate(date).reduce((sum, entry) => sum + entry.durationMinutes, 0);
  }

  getTotalMinutesByDateRange(startDate: string, endDate: string): number {
    return this.getByDateRange(startDate, endDate).reduce(
      (sum, entry) => sum + entry.durationMinutes,
      0
    );
  }
}

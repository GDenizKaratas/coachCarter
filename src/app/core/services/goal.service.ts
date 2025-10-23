import { Injectable, signal, computed, inject } from '@angular/core';
import { Goal } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private storageService = inject(StorageService);
  private readonly STORAGE_KEY = 'goals';

  private goalsSignal = signal<Goal[]>([]);

  goals = this.goalsSignal.asReadonly();

  constructor() {
    this.loadGoals();
  }

  private loadGoals(): void {
    const stored = this.storageService.get<Goal[]>(this.STORAGE_KEY);
    this.goalsSignal.set(stored || []);
  }

  private saveGoals(): void {
    this.storageService.set(this.STORAGE_KEY, this.goalsSignal());
  }

  add(goal: Omit<Goal, 'id' | 'createdAt'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    this.goalsSignal.update((goals) => [...goals, newGoal]);
    this.saveGoals();
    return newGoal;
  }

  update(id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>): boolean {
    const goal = this.getById(id);
    if (!goal) return false;

    const updatedGoal = { ...goal, ...updates };
    this.goalsSignal.update((goals) => goals.map((g) => (g.id === id ? updatedGoal : g)));
    this.saveGoals();
    return true;
  }

  delete(id: string): boolean {
    const goal = this.getById(id);
    if (!goal) return false;

    this.goalsSignal.update((goals) => goals.filter((g) => g.id !== id));
    this.saveGoals();
    return true;
  }

  getById(id: string): Goal | undefined {
    return this.goalsSignal().find((goal) => goal.id === id);
  }

  getByCategory(categoryId: string): Goal[] {
    return this.goalsSignal().filter((goal) => goal.categoryId === categoryId);
  }
}

import { Injectable, signal, computed, inject } from '@angular/core';
import { Category } from '../models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private storageService = inject(StorageService);
  private readonly STORAGE_KEY = 'categories';

  private categoriesSignal = signal<Category[]>([]);

  categories = this.categoriesSignal.asReadonly();

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    const stored = this.storageService.get<Category[]>(this.STORAGE_KEY);
    this.categoriesSignal.set(stored || []);
  }

  private saveCategories(): void {
    this.storageService.set(this.STORAGE_KEY, this.categoriesSignal());
  }

  add(category: Omit<Category, 'id' | 'createdAt'>): Category {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    this.categoriesSignal.update((categories) => [...categories, newCategory]);
    this.saveCategories();
    return newCategory;
  }

  update(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): boolean {
    const category = this.getById(id);
    if (!category) return false;

    const updatedCategory = { ...category, ...updates };
    this.categoriesSignal.update((categories) =>
      categories.map((cat) => (cat.id === id ? updatedCategory : cat))
    );
    this.saveCategories();
    return true;
  }

  delete(id: string): boolean {
    const category = this.getById(id);
    if (!category) return false;

    this.categoriesSignal.update((categories) => categories.filter((cat) => cat.id !== id));
    this.saveCategories();
    return true;
  }

  getById(id: string): Category | undefined {
    return this.categoriesSignal().find((cat) => cat.id === id);
  }

  getByName(name: string): Category | undefined {
    return this.categoriesSignal().find((cat) => cat.name.toLowerCase() === name.toLowerCase());
  }
}

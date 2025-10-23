import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="categories-container">
      <div class="header">
        <h1>Kategoriler</h1>
        <button class="btn btn-primary" (click)="showAddForm()">+ Yeni Kategori</button>
      </div>

      @if (showForm()) {
      <div class="form-container">
        <h3>{{ editingCategory() ? 'Kategori Düzenle' : 'Yeni Kategori' }}</h3>
        <form (ngSubmit)="saveCategory()" class="category-form">
          <div class="form-group">
            <label for="name">Kategori Adı</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="formData().name"
              name="name"
              class="input"
              required
            />
          </div>

          <div class="form-group">
            <label for="color">Renk</label>
            <div class="color-picker">
              @for (color of colorOptions; track color) {
              <button
                type="button"
                class="color-option"
                [class.selected]="formData().color === color"
                [style.background]="color"
                (click)="updateColor(color)"
              ></button>
              }
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="cancelForm()">İptal</button>
            <button type="submit" class="btn btn-primary" [disabled]="!formData().name">
              {{ editingCategory() ? 'Güncelle' : 'Kaydet' }}
            </button>
          </div>
        </form>
      </div>
      }

      <div class="categories-grid">
        @for (category of categories(); track category.id) {
        <div class="category-card">
          <div class="category-header">
            <span class="category-dot" [style.background]="category.color"></span>
            <span class="category-name">{{ category.name }}</span>
          </div>
          <div class="category-actions">
            <button class="btn-icon" (click)="editCategory(category)" title="Düzenle">✏️</button>
            <button class="btn-icon" (click)="deleteCategory(category.id)" title="Sil">🗑️</button>
          </div>
        </div>
        }
      </div>

      @if (categories().length === 0) {
      <div class="empty-state">
        <p>Henüz kategori eklenmemiş.</p>
        <button class="btn btn-primary" (click)="showAddForm()">İlk Kategoriyi Ekle</button>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .categories-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .header h1 {
        margin: 0;
        font-size: 2rem;
        color: #1f2937;
      }

      .form-container {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .form-container h3 {
        margin: 0 0 1rem 0;
        color: #374151;
      }

      .category-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        font-weight: 600;
        color: #374151;
      }

      .input {
        padding: 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s;
      }

      .input:focus {
        border-color: #3b82f6;
      }

      .color-picker {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .color-option {
        width: 40px;
        height: 40px;
        border: 3px solid transparent;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
      }

      .color-option:hover {
        transform: scale(1.1);
      }

      .color-option.selected {
        border-color: #1f2937;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }

      .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }

      .category-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .category-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .category-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
      }

      .category-name {
        font-weight: 600;
        color: #374151;
      }

      .category-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn-icon {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 6px;
        transition: background-color 0.2s;
      }

      .btn-icon:hover {
        background: #f3f4f6;
      }

      .empty-state {
        text-align: center;
        padding: 3rem;
        color: #6b7280;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-block;
      }

      .btn-primary {
        background: #3b82f6;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background: #2563eb;
      }

      .btn-primary:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-secondary {
        background: #f3f4f6;
        color: #374151;
      }

      .btn-secondary:hover {
        background: #e5e7eb;
      }
    `,
  ],
})
export class CategoriesPage {
  private categoryService = inject(CategoryService);

  categories = this.categoryService.categories;
  showForm = signal(false);
  editingCategory = signal<Category | null>(null);

  formData = signal({
    name: '',
    color: '#3b82f6',
  });

  colorOptions = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#ec4899',
    '#6366f1',
  ];

  showAddForm(): void {
    this.formData.set({ name: '', color: '#3b82f6' });
    this.editingCategory.set(null);
    this.showForm.set(true);
  }

  editCategory(category: Category): void {
    this.formData.set({
      name: category.name,
      color: category.color,
    });
    this.editingCategory.set(category);
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingCategory.set(null);
  }

  saveCategory(): void {
    const data = this.formData();
    if (!data.name.trim()) return;

    if (this.editingCategory()) {
      this.categoryService.update(this.editingCategory()!.id, data);
    } else {
      this.categoryService.add(data);
    }

    this.cancelForm();
  }

  deleteCategory(id: string): void {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      this.categoryService.delete(id);
    }
  }

  updateColor(color: string): void {
    this.formData.update((data) => ({ ...data, color }));
  }
}

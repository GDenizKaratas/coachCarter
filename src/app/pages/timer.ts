import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimerService } from '../core/services/timer.service';
import { CategoryService } from '../core/services/category.service';
import { GoalService } from '../core/services/goal.service';
import { TimeEntryService } from '../core/services/time-entry.service';
import { DurationPipe } from '../shared/duration.pipe';
import { DurationHelpers } from '../core/utils/duration-helpers';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, FormsModule, DurationPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Timer</h1>
        <p class="mt-2 text-gray-600">Zaman takibinizi başlatın</p>
      </div>

      <!-- Timer Display -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-64 h-64 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg"
        >
          <div class="text-center text-white">
            <div class="text-6xl font-mono font-bold">{{ formattedTime() }}</div>
            @if (timerService.isRunning()) {
            <div class="mt-2 text-lg opacity-90">
              {{ getCategoryName(timerService.selectedCategory()!) }}
            </div>
            }
          </div>
        </div>
      </div>

      <!-- Timer Controls -->
      @if (!timerService.isRunning()) {
      <div class="max-w-md mx-auto mb-8">
        <div class="space-y-4">
          <!-- Category Selection -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-bullseye inline w-4 h-4 mr-1"></i>
              Kategori
            </label>
            <select
              id="category"
              [(ngModel)]="selectedCategoryId"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option [value]="null">Kategori seçin...</option>
              @for (cat of categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
              }
            </select>
          </div>

          <!-- Goal Selection -->
          @if (selectedCategoryId()) {
          <div>
            <label for="goal" class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-bullseye inline w-4 h-4 mr-1"></i>
              Hedef (Opsiyonel)
            </label>
            <select
              id="goal"
              [(ngModel)]="selectedGoalId"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option [value]="null">Hedef seçin...</option>
              @for (goal of filteredGoals(); track goal.id) {
              <option [value]="goal.id">{{ goal.name }}</option>
              }
            </select>
          </div>
          }

          <!-- Start Button -->
          <button
            (click)="start()"
            [disabled]="!selectedCategoryId()"
            class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fas fa-play w-5 h-5 mr-2"></i>
            Başlat
          </button>
        </div>
      </div>
      } @else {
      <!-- Active Timer Controls -->
      <div class="max-w-md mx-auto mb-8">
        <div class="flex space-x-4">
          <button
            (click)="pause()"
            class="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <i class="fas fa-pause w-5 h-5 mr-2"></i>
            Duraklat
          </button>
          <button
            (click)="stop()"
            class="flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <i class="fas fa-stop w-5 h-5 mr-2"></i>
            Bitir
          </button>
        </div>
      </div>
      }

      <!-- Today's Summary -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center mb-4">
            <i class="fas fa-clock h-5 w-5 text-gray-400 mr-2"></i>
            <h3 class="text-lg font-medium text-gray-900">Bugün</h3>
          </div>

          <div class="mb-4">
            <div class="text-3xl font-bold text-gray-900">
              {{ todayTotalMinutes() | duration : 'short' }}
            </div>
            <div class="text-sm text-gray-500">Toplam süre</div>
          </div>

          @if (todayEntries().length > 0) {
          <div class="space-y-3">
            @for (entry of todayEntries(); track entry.id) {
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <div
                  class="w-3 h-3 rounded-full mr-3"
                  [style.background-color]="getCategoryColor(entry.categoryId)"
                ></div>
                <span class="text-sm font-medium text-gray-900">{{
                  getCategoryName(entry.categoryId)
                }}</span>
              </div>
              <span class="text-sm font-semibold text-gray-600">{{
                entry.durationMinutes | duration : 'short'
              }}</span>
            </div>
            }
          </div>
          } @else {
          <div class="text-center py-6">
            <i class="fas fa-clock mx-auto h-8 w-8 text-gray-400"></i>
            <p class="mt-2 text-sm text-gray-500">Henüz bugün için aktivite kaydı yok</p>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class TimerPage {
  timerService = inject(TimerService);
  private categoryService = inject(CategoryService);
  private goalService = inject(GoalService);
  private timeEntryService = inject(TimeEntryService);

  selectedCategoryId = signal<string | null>(null);
  selectedGoalId = signal<string | null>(null);

  categories = this.categoryService.categories;
  todayEntries = this.timeEntryService.todayEntries;

  filteredGoals = computed(() => {
    const catId = this.selectedCategoryId();
    return catId ? this.goalService.getByCategory(catId) : [];
  });

  todayTotalMinutes = computed(() =>
    this.todayEntries().reduce((sum, e) => sum + e.durationMinutes, 0)
  );

  formattedTime = computed(() => {
    const seconds = this.timerService.elapsedSeconds();
    return DurationHelpers.formatSeconds(seconds);
  });

  start(): void {
    const catId = this.selectedCategoryId();
    const goalId = this.selectedGoalId();
    if (catId) {
      this.timerService.start(catId, goalId || undefined);
    }
  }

  pause(): void {
    this.timerService.pause();
  }

  stop(): void {
    const entry = this.timerService.stop();
    if (entry) {
      this.timeEntryService.add(entry);
      this.selectedCategoryId.set(null);
      this.selectedGoalId.set(null);
    }
  }

  getCategoryColor(categoryId: string): string {
    return this.categoryService.getById(categoryId)?.color || '#9ca3af';
  }

  getCategoryName(categoryId: string): string {
    return this.categoryService.getById(categoryId)?.name || 'Unknown';
  }
}

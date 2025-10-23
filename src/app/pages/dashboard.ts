import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimerService } from '../core/services/timer.service';
import { CategoryService } from '../core/services/category.service';
import { TimeEntryService } from '../core/services/time-entry.service';
import { AnalyticsService } from '../core/services/analytics.service';
import { DurationPipe } from '../shared/duration.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DurationPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">{{ todayDate() }}</p>
      </div>

      <!-- Active Timer Alert -->
      @if (timerService.isRunning()) {
      <div class="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-clock h-6 w-6 text-amber-600"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-amber-800">Timer Aktif</h3>
              <div class="mt-1">
                <p class="text-sm text-amber-700">
                  <span class="font-mono text-lg">{{ formattedTime() }}</span> -
                  {{ getCategoryName(timerService.selectedCategory()!) }}
                </p>
              </div>
            </div>
          </div>
          <button
            (click)="stopTimer()"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <i class="fas fa-stop h-4 w-4 mr-1"></i>
            Bitir
          </button>
        </div>
      </div>
      }

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-clock h-6 w-6 text-blue-600"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Bugün Toplam</dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ todayTotalMinutes() | duration : 'short' }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-chart-bar h-6 w-6 text-green-600"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Aktivite</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ todayEntries().length }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-folder-open h-6 w-6 text-purple-600"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Kategori</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ categories().length }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Breakdown -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Bugünün Dağılımı</h3>
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
          <div class="text-center py-8">
            <i class="fas fa-clock mx-auto h-12 w-12 text-gray-400"></i>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Henüz aktivite yok</h3>
            <p class="mt-1 text-sm text-gray-500">Timer'ı başlatarak ilk aktivitenizi kaydedin.</p>
            <div class="mt-6">
              <a
                routerLink="/timer"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i class="fas fa-play h-4 w-4 mr-2"></i>
                Timer'ı Başlat
              </a>
            </div>
          </div>
          }
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              routerLink="/timer"
              class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <div>
                <span class="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                  <i class="fas fa-clock h-6 w-6"></i>
                </span>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true"></span>
                  Timer
                </h3>
                <p class="mt-2 text-sm text-gray-500">Zaman takibine başla</p>
              </div>
            </a>

            <a
              routerLink="/categories"
              class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <div>
                <span
                  class="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white"
                >
                  <i class="fas fa-folder-open h-6 w-6"></i>
                </span>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true"></span>
                  Kategoriler
                </h3>
                <p class="mt-2 text-sm text-gray-500">Kategorileri yönet</p>
              </div>
            </a>

            <a
              routerLink="/analytics"
              class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <div>
                <span
                  class="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white"
                >
                  <i class="fas fa-chart-line h-6 w-6"></i>
                </span>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true"></span>
                  Analitik
                </h3>
                <p class="mt-2 text-sm text-gray-500">Performans analizi</p>
              </div>
            </a>

            <div class="relative group bg-white p-6 rounded-lg border border-gray-300 opacity-50">
              <div>
                <span class="rounded-lg inline-flex p-3 bg-gray-50 text-gray-400 ring-4 ring-white">
                  <i class="fas fa-chart-bar h-6 w-6"></i>
                </span>
              </div>
              <div class="mt-4">
                <h3 class="text-lg font-medium text-gray-400">Hedefler</h3>
                <p class="mt-2 text-sm text-gray-400">Yakında...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardPage {
  timerService = inject(TimerService);
  private categoryService = inject(CategoryService);
  private timeEntryService = inject(TimeEntryService);
  private analyticsService = inject(AnalyticsService);

  categories = this.categoryService.categories;
  todayEntries = this.timeEntryService.todayEntries;

  todayTotalMinutes = computed(() =>
    this.todayEntries().reduce((sum, e) => sum + e.durationMinutes, 0)
  );

  todayDate = computed(() => {
    const today = new Date();
    return today.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  formattedTime = computed(() => {
    const seconds = this.timerService.elapsedSeconds();
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  });

  stopTimer(): void {
    const entry = this.timerService.stop();
    if (entry) {
      this.timeEntryService.add(entry);
    }
  }

  getCategoryColor(categoryId: string): string {
    return this.categoryService.getById(categoryId)?.color || '#9ca3af';
  }

  getCategoryName(categoryId: string): string {
    return this.categoryService.getById(categoryId)?.name || 'Unknown';
  }
}

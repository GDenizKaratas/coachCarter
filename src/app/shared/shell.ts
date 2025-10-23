import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">Coach Carter</h1>
            </div>

            <div class="hidden md:flex items-center space-x-8">
              <a
                routerLink="/dashboard"
                routerLinkActive="bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <i class="fas fa-chart-bar w-4 h-4 mr-2"></i>
                Dashboard
              </a>
              <a
                routerLink="/timer"
                routerLinkActive="bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <i class="fas fa-clock w-4 h-4 mr-2"></i>
                Timer
              </a>
              <a
                routerLink="/categories"
                routerLinkActive="bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <i class="fas fa-folder-open w-4 h-4 mr-2"></i>
                Kategoriler
              </a>
              <a
                routerLink="/analytics"
                routerLinkActive="bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <i class="fas fa-chart-line w-4 h-4 mr-2"></i>
                Analitik
              </a>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden">
              <button
                type="button"
                class="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                (click)="toggleMobileMenu()"
              >
                <span class="sr-only">Open main menu</span>
                <i class="fas fa-bars h-6 w-6"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu -->
        <div class="md:hidden" [class.hidden]="!mobileMenuOpen">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <a
              routerLink="/dashboard"
              routerLinkActive="bg-blue-50 text-blue-700"
              class="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <i class="fas fa-chart-bar w-4 h-4 mr-2"></i>
              Dashboard
            </a>
            <a
              routerLink="/timer"
              routerLinkActive="bg-blue-50 text-blue-700"
              class="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <i class="fas fa-clock w-4 h-4 mr-2"></i>
              Timer
            </a>
            <a
              routerLink="/categories"
              routerLinkActive="bg-blue-50 text-blue-700"
              class="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <i class="fas fa-folder-open w-4 h-4 mr-2"></i>
              Kategoriler
            </a>
            <a
              routerLink="/analytics"
              routerLinkActive="bg-blue-50 text-blue-700"
              class="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <i class="fas fa-chart-line w-4 h-4 mr-2"></i>
              Analitik
            </a>
          </div>
        </div>
      </nav>

      <!-- Main content -->
      <main class="flex-1">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {
  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}

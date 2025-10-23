import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';
import { DurationPipe } from '../../shared/duration.pipe';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, DurationPipe],
  template: `
    <div class="analytics-container">
      <div class="header">
        <h1>Analitik</h1>
        <p class="subtitle">Zaman takibi ve performans analizi</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ weeklyTotal() | duration : 'short' }}</div>
          <div class="stat-label">Bu Hafta Toplam</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ weeklyAverage() | duration : 'short' }}</div>
          <div class="stat-label">Günlük Ortalama</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">{{ activeDays() }}</div>
          <div class="stat-label">Aktif Gün</div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-container">
          <h3>Haftalık Dağılım</h3>
          <div class="weekly-chart">
            @for (day of weeklyData(); track day.date) {
            <div class="day-bar">
              <div class="bar" [style.height.%]="getBarHeight(day.totalMinutes)">
                <span class="bar-value">{{ day.totalMinutes | duration : 'short' }}</span>
              </div>
              <div class="day-label">{{ day.dayName }}</div>
            </div>
            }
          </div>
        </div>

        <div class="chart-container">
          <h3>Kategori Dağılımı</h3>
          <div class="category-chart">
            @for (item of categoryDistribution(); track item.category.id) {
            <div class="category-item">
              <div class="category-info">
                <span class="category-dot" [style.background]="item.category.color"></span>
                <span class="category-name">{{ item.category.name }}</span>
              </div>
              <div class="category-stats">
                <span class="category-time">{{ item.totalMinutes | duration : 'short' }}</span>
                <span class="category-percentage">{{ item.percentage.toFixed(1) }}%</span>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .analytics-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem;
      }

      .header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .header h1 {
        margin: 0 0 0.5rem 0;
        font-size: 2.5rem;
        color: #1f2937;
      }

      .subtitle {
        color: #6b7280;
        font-size: 1.125rem;
        margin: 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
      }

      .stat-label {
        color: #6b7280;
        font-size: 0.875rem;
      }

      .charts-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      .chart-container {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .chart-container h3 {
        margin: 0 0 1.5rem 0;
        color: #374151;
      }

      .weekly-chart {
        display: flex;
        align-items: end;
        gap: 0.5rem;
        height: 200px;
        padding: 1rem 0;
      }

      .day-bar {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
      }

      .bar {
        width: 100%;
        background: linear-gradient(to top, #3b82f6, #60a5fa);
        border-radius: 4px 4px 0 0;
        position: relative;
        min-height: 20px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
      }

      .bar-value {
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .day-label {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: #6b7280;
        font-weight: 500;
      }

      .category-chart {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .category-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #f9fafb;
        border-radius: 6px;
      }

      .category-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .category-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }

      .category-name {
        font-weight: 500;
        color: #374151;
      }

      .category-stats {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.25rem;
      }

      .category-time {
        font-weight: 600;
        color: #1f2937;
      }

      .category-percentage {
        font-size: 0.75rem;
        color: #6b7280;
      }

      @media (max-width: 768px) {
        .charts-section {
          grid-template-columns: 1fr;
        }

        .weekly-chart {
          height: 150px;
        }
      }
    `,
  ],
})
export class AnalyticsPage {
  private analyticsService = inject(AnalyticsService);

  weeklyData = this.analyticsService.weeklyData;
  categoryDistribution = this.analyticsService.categoryDistribution;

  weeklyTotal = computed(() => {
    return this.weeklyData().reduce((sum, day) => sum + day.totalMinutes, 0);
  });

  weeklyAverage = computed(() => {
    const total = this.weeklyTotal();
    const activeDays = this.activeDays();
    return activeDays > 0 ? Math.round(total / activeDays) : 0;
  });

  activeDays = computed(() => {
    return this.weeklyData().filter((day) => day.totalMinutes > 0).length;
  });

  getBarHeight(minutes: number): number {
    const maxMinutes = Math.max(...this.weeklyData().map((day) => day.totalMinutes));
    if (maxMinutes === 0) return 0;
    return Math.max((minutes / maxMinutes) * 100, 5);
  }
}

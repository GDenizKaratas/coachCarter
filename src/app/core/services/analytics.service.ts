import { Injectable, signal, computed, inject } from '@angular/core';
import { TimeEntry } from '../models';
import { TimeEntryService } from './time-entry.service';
import { CategoryService } from './category.service';
import { GoalService } from './goal.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private timeEntryService = inject(TimeEntryService);
  private categoryService = inject(CategoryService);
  private goalService = inject(GoalService);

  weeklyData = computed(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const weekData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const entries = this.timeEntryService.getByDate(dateStr);
      const totalMinutes = entries.reduce((sum, entry) => sum + entry.durationMinutes, 0);

      weekData.push({
        date: dateStr,
        dayName: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
        totalMinutes,
        entries,
      });
    }

    return weekData;
  });

  monthlyData = computed(() => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthData = [];
    for (let i = 1; i <= monthEnd.getDate(); i++) {
      const date = new Date(monthStart);
      date.setDate(i);
      const dateStr = date.toISOString().split('T')[0];

      const entries = this.timeEntryService.getByDate(dateStr);
      const totalMinutes = entries.reduce((sum, entry) => sum + entry.durationMinutes, 0);

      monthData.push({
        date: dateStr,
        day: i,
        totalMinutes,
        entries,
      });
    }

    return monthData;
  });

  categoryDistribution = computed(() => {
    const categories = this.categoryService.categories();
    const entries = this.timeEntryService.timeEntries();

    return categories
      .map((category) => {
        const categoryEntries = entries.filter((entry) => entry.categoryId === category.id);
        const totalMinutes = categoryEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0);

        return {
          category,
          totalMinutes,
          percentage:
            entries.length > 0
              ? (totalMinutes / entries.reduce((sum, e) => sum + e.durationMinutes, 0)) * 100
              : 0,
        };
      })
      .filter((item) => item.totalMinutes > 0);
  });

  goalProgress = computed(() => {
    const goals = this.goalService.goals();
    const entries = this.timeEntryService.timeEntries();

    return goals.map((goal) => {
      const goalEntries = entries.filter((entry) => entry.goalId === goal.id);
      const totalMinutes = goalEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0);

      const today = new Date().toISOString().split('T')[0];
      const todayEntries = goalEntries.filter((entry) => entry.date === today);
      const todayMinutes = todayEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0);

      return {
        goal,
        totalMinutes,
        todayMinutes,
        dailyProgress: goal.targetMinutes.daily
          ? (todayMinutes / goal.targetMinutes.daily) * 100
          : 0,
        weeklyProgress: goal.targetMinutes.weekly ? this.getWeeklyProgress(goal.id) : 0,
        monthlyProgress: goal.targetMinutes.monthly ? this.getMonthlyProgress(goal.id) : 0,
      };
    });
  });

  private getWeeklyProgress(goalId: string): number {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const weekEntries = this.timeEntryService
      .getByDateRange(weekStartStr, weekEndStr)
      .filter((entry) => entry.goalId === goalId);

    const weekMinutes = weekEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0);
    const goal = this.goalService.getById(goalId);

    return goal?.targetMinutes.weekly ? (weekMinutes / goal.targetMinutes.weekly) * 100 : 0;
  }

  private getMonthlyProgress(goalId: string): number {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthStartStr = monthStart.toISOString().split('T')[0];
    const monthEndStr = monthEnd.toISOString().split('T')[0];

    const monthEntries = this.timeEntryService
      .getByDateRange(monthStartStr, monthEndStr)
      .filter((entry) => entry.goalId === goalId);

    const monthMinutes = monthEntries.reduce((sum, entry) => sum + entry.durationMinutes, 0);
    const goal = this.goalService.getById(goalId);

    return goal?.targetMinutes.monthly ? (monthMinutes / goal.targetMinutes.monthly) * 100 : 0;
  }
}

import { Injectable, signal, computed } from '@angular/core';
import { TimerState, TimeEntry } from '../models';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private timerState = signal<TimerState>({
    isRunning: false,
    startTime: null,
    elapsedSeconds: 0,
    selectedCategoryId: null,
    selectedGoalId: null,
  });

  isRunning = computed(() => this.timerState().isRunning);
  elapsedSeconds = computed(() => this.timerState().elapsedSeconds);
  selectedCategory = computed(() => this.timerState().selectedCategoryId);
  selectedGoal = computed(() => this.timerState().selectedGoalId);

  private intervalId: any = null;

  start(categoryId: string, goalId?: string): void {
    this.timerState.update((state) => ({
      ...state,
      isRunning: true,
      startTime: Date.now(),
      selectedCategoryId: categoryId,
      selectedGoalId: goalId || null,
    }));

    this.intervalId = setInterval(() => {
      this.timerState.update((state) => ({
        ...state,
        elapsedSeconds: state.elapsedSeconds + 1,
      }));
    }, 1000);
  }

  stop(): TimeEntry | null {
    if (!this.isRunning()) return null;

    clearInterval(this.intervalId);
    const state = this.timerState();

    this.timerState.set({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      selectedCategoryId: null,
      selectedGoalId: null,
    });

    return {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      startTime: state?.startTime === null ? undefined : state?.startTime,
      endTime: Date.now(),
      durationMinutes: Math.floor(state.elapsedSeconds / 60),
      categoryId: state.selectedCategoryId!,
      goalId: state.selectedGoalId || undefined,
    };
  }

  pause(): void {
    clearInterval(this.intervalId);
    this.timerState.update((state) => ({ ...state, isRunning: false }));
  }

  resume(): void {
    this.timerState.update((state) => ({ ...state, isRunning: true }));
    this.intervalId = setInterval(() => {
      this.timerState.update((state) => ({
        ...state,
        elapsedSeconds: state.elapsedSeconds + 1,
      }));
    }, 1000);
  }

  reset(): void {
    clearInterval(this.intervalId);
    this.timerState.set({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      selectedCategoryId: null,
      selectedGoalId: null,
    });
  }
}

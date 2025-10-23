export interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedSeconds: number;
  selectedCategoryId: string | null;
  selectedGoalId: string | null;
}

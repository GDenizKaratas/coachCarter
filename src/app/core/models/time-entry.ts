export interface TimeEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  startTime?: number; // timestamp
  endTime?: number; // timestamp
  durationMinutes: number;
  categoryId: string;
  goalId?: string;
  notes?: string;
  tags?: string[];
}

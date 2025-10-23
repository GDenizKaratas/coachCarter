export class DurationHelpers {
  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  }

  static formatDurationShort(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}`;
    }
    return `${mins}dk`;
  }

  static formatSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  static minutesToHours(minutes: number): number {
    return Math.round((minutes / 60) * 100) / 100;
  }

  static hoursToMinutes(hours: number): number {
    return Math.round(hours * 60);
  }

  static getTotalMinutes(entries: { durationMinutes: number }[]): number {
    return entries.reduce((sum, entry) => sum + entry.durationMinutes, 0);
  }

  static getAverageMinutes(entries: { durationMinutes: number }[]): number {
    if (entries.length === 0) return 0;
    return Math.round(this.getTotalMinutes(entries) / entries.length);
  }
}

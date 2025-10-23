export class DateHelpers {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static getToday(): string {
    return this.formatDate(new Date());
  }

  static getWeekStart(date: Date = new Date()): Date {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    return weekStart;
  }

  static getWeekEnd(date: Date = new Date()): Date {
    const weekEnd = new Date(date);
    weekEnd.setDate(date.getDate() + (6 - date.getDay()));
    return weekEnd;
  }

  static getMonthStart(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static getMonthEnd(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  }

  static isToday(dateStr: string): boolean {
    return dateStr === this.getToday();
  }

  static isThisWeek(dateStr: string): boolean {
    const date = new Date(dateStr);
    const weekStart = this.getWeekStart();
    const weekEnd = this.getWeekEnd();
    return date >= weekStart && date <= weekEnd;
  }

  static isThisMonth(dateStr: string): boolean {
    const date = new Date(dateStr);
    const monthStart = this.getMonthStart();
    const monthEnd = this.getMonthEnd();
    return date >= monthStart && date <= monthEnd;
  }
}

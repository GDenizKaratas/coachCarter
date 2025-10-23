import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRange',
  standalone: true,
})
export class DateRangePipe implements PipeTransform {
  transform(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startStr = start.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
    });
    const endStr = end.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined,
    });

    return `${startStr} - ${endStr}`;
  }
}

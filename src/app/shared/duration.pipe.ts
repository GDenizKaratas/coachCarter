import { Pipe, PipeTransform } from '@angular/core';
import { DurationHelpers } from '../core/utils/duration-helpers';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(minutes: number, format: 'full' | 'short' = 'full'): string {
    if (format === 'short') {
      return DurationHelpers.formatDurationShort(minutes);
    }
    return DurationHelpers.formatDuration(minutes);
  }
}

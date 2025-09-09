import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDiff',
  standalone: true
})
export class DateDiffPipe implements PipeTransform {
  transform(end: Date | string, start: Date | string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1, 0);
  }
}

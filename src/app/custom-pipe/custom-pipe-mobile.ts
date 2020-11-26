import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mobile' })
export class CustomPipeMobilePipe implements PipeTransform {
  transform(value: string, pretext?: string): string{
        return value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
}


import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'thousandSpace'
})
export class ThousandSpacePipe implements PipeTransform {

  transform(value: number | string): string {
    if (value == null) return '';

    let parts = value.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
  }

}

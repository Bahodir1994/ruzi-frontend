import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    decimalPlaces: number = 2,
    thousandSeparator: string = ' ',
    currencySymbol: string = '',
    currencyPosition: 'left' | 'right' = 'right'
  ): string | null {
    if (value == null || isNaN(value)) return null;

    // Округляем число до decimalPlaces знаков после запятой
    const fixed = value.toFixed(decimalPlaces);

    // Разделяем целую и дробную часть
    const parts = fixed.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1] : '';

    // Форматируем целую часть — ставим thousandSeparator каждые 3 цифры справа налево
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

    // Формируем итоговую строку с десятичной частью (если decimalPlaces > 0)
    const formattedNumber = decimalPlaces > 0 ? integerPart + '.' + decimalPart : integerPart;

    // Добавляем символ валюты слева или справа
    if (currencySymbol) {
      if (currencyPosition === 'left') {
        return currencySymbol + ' ' + formattedNumber;
      } else {
        return formattedNumber + ' ' + currencySymbol;
      }
    }

    return formattedNumber;
  }

}

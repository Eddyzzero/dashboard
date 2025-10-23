import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currency' })
export class CurrencyPipe implements PipeTransform {
    transform(value: number | string | null | undefined, currencySign = '€'): string {
        if (value == null) return `${currencySign}0.00`;
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return `${currencySign}${num.toFixed(2)}`;
    }
}

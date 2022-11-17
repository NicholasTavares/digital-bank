import { HttpException } from '@nestjs/common';

export function ToNumber(value: any): number {
  if (typeof value === 'string') {
    const number = parseFloat(value);
    console.log('FLOAT', number);
    return number;
  }

  if (typeof value === 'number') {
    return value;
  }

  throw new HttpException('Valor inválido', 400);
}

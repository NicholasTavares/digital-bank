import { HttpException } from '@nestjs/common';

export function ToNumber(value: any): number {
  if (typeof value === 'string') {
    const number = Number(value);
    return number;
  }

  if (typeof value === 'number') {
    return value;
  }

  throw new HttpException('Valor inválido', 400);
}

const RU_NUMBER_FORMATTER = new Intl.NumberFormat('ru-RU');

export const Formatter = {
  number(value: number): string {
    return RU_NUMBER_FORMATTER.format(value);
  },
  price(value: number, currency = '₽'): string {
    return `${RU_NUMBER_FORMATTER.format(value)} ${currency}`;
  },
} as const;

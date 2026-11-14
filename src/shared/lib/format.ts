const RU_NUMBER_FORMATTER = new Intl.NumberFormat('ru-RU');

function pluralizeRu(count: number, forms: [string, string, string]): string {
  const abs = Math.abs(Math.trunc(count)) % 100;
  const lastDigit = abs % 10;

  if (abs > 10 && abs < 20) {
    return forms[2];
  }
  if (lastDigit > 1 && lastDigit < 5) {
    return forms[1];
  }
  if (lastDigit === 1) {
    return forms[0];
  }
  return forms[2];
}

export const Formatter = {
  number(value: number): string {
    return RU_NUMBER_FORMATTER.format(value);
  },
  price(value: number, currency = '₽'): string {
    return `${RU_NUMBER_FORMATTER.format(value)} ${currency}`;
  },
  bonus(value: number): string {
    const unit = pluralizeRu(value, ['бонус', 'бонуса', 'бонусов']);
    return `${RU_NUMBER_FORMATTER.format(value)} ${unit}`;
  },
} as const;

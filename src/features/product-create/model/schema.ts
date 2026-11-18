import { z } from 'zod';
import { PRODUCT_CATEGORY_LABELS } from '@/entities/product';

const CATEGORY_VALUES = Object.keys(PRODUCT_CATEGORY_LABELS);

export const createProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Название минимум 3 символа')
    .max(120, 'Название не длиннее 120 символов'),
  category: z.string().refine((value) => CATEGORY_VALUES.includes(value), 'Выберите категорию'),
  price: z
    .string()
    .trim()
    .min(1, 'Укажите цену')
    .regex(/^\d+$/, 'Цена — целое число рублей')
    .refine((value) => Number(value) >= 1, 'Цена должна быть больше 0')
    .refine((value) => Number(value) <= 10_000_000, 'Слишком большая цена'),
  description: z.string().trim().max(2000, 'Описание не длиннее 2000 символов'),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;

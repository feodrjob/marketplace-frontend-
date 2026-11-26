import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Введите email').email('Введите корректный email адрес'),
  password: z.string().min(1, 'Введите пароль'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerBuyerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Введите имя и фамилию (не менее 2 символов)'),
    email: z.string().trim().min(1, 'Введите email').email('Введите корректный email адрес'),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || /^[+]?[\d\s()-]{10,20}$/.test(value),
        'Введите корректный номер телефона'
      ),
    password: z.string().min(8, 'Пароль должен содержать не менее 8 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
    termsAccepted: z.boolean().refine((value) => value === true, {
      message: 'Необходимо согласиться с условиями использования',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterBuyerFormValues = z.infer<typeof registerBuyerSchema>;

export const registerSellerSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(2, 'Введите название компании (не менее 2 символов)')
      .max(120, 'Название не длиннее 120 символов'),
    inn: z
      .string()
      .trim()
      .regex(/^(\d{10}|\d{12})$/, 'ИНН должен содержать 10 или 12 цифр'),
    email: z.string().trim().min(1, 'Введите email').email('Введите корректный email адрес'),
    password: z.string().min(8, 'Пароль должен содержать не менее 8 символов'),
    confirmPassword: z.string().min(1, 'Повторите пароль'),
    description: z.string().trim().max(1000, 'Описание не длиннее 1000 символов'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterSellerFormValues = z.infer<typeof registerSellerSchema>;

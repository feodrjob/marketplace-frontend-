import {
  Alert,
  Anchor,
  Button,
  PasswordInput,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Link, useNavigate } from 'react-router-dom';
import { type RegisterSellerFormValues, registerSellerSchema } from '@/entities/user';
import { useRegisterSellerMutation } from '@/features/auth-by-email';
import { getErrorMessage, getValidationErrors } from '@/shared/lib';
import { AuthCardLayout } from '@/shared/ui';

export function RegisterSellerPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterSellerMutation();

  const form = useForm<RegisterSellerFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      companyName: '',
      inn: '',
      email: '',
      password: '',
      confirmPassword: '',
      description: '',
    },
    validate: zod4Resolver(registerSellerSchema),
  });

  const handleSubmit = form.onSubmit((values) => {
    registerMutation.mutate(
      {
        companyName: values.companyName.trim(),
        inn: values.inn.trim(),
        email: values.email.trim(),
        password: values.password,
        description: values.description.trim() || undefined,
      },
      {
        onSuccess: () => {
          navigate('/profile', { replace: true });
        },
        onError: (error) => {
          const details = getValidationErrors(error);
          if (details) {
            form.setErrors(details);
          }
        },
      }
    );
  });

  const nonFieldError =
    registerMutation.isError && !getValidationErrors(registerMutation.error)
      ? getErrorMessage(registerMutation.error, 'Ошибка при регистрации продавца')
      : null;

  return (
    <AuthCardLayout
      title="Регистрация продавца"
      subtitle="Создайте профиль продавца и публикуйте товары в каталоге"
      footer={
        <Text fz={13} c="dimmed" ta="center" mt="md">
          Уже есть аккаунт?{' '}
          <Anchor component={Link} to="/login" size="sm">
            Войти в аккаунт
          </Anchor>
        </Text>
      }
      belowCard={
        <Text fz={12} c="dimmed" ta="center" mt="md">
          Хотите покупать?{' '}
          <Anchor component={Link} to="/register" size="sm">
            Регистрация покупателя
          </Anchor>
        </Text>
      }
    >
      {nonFieldError && (
        <Alert color="red" mb="md" radius="sm">
          {nonFieldError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap="sm">
          <TextInput
            label="Название компании"
            autoComplete="organization"
            required
            maxLength={120}
            placeholder="ООО «Магазин»"
            radius="sm"
            key={form.key('companyName')}
            {...form.getInputProps('companyName')}
          />

          <TextInput
            label="ИНН"
            required
            inputMode="numeric"
            maxLength={12}
            description="10 цифр для организации или 12 для ИП"
            placeholder="7701234567"
            radius="sm"
            key={form.key('inn')}
            {...form.getInputProps('inn')}
          />

          <TextInput
            label="Email"
            type="email"
            autoComplete="email"
            required
            placeholder="seller@t-market.ru"
            radius="sm"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Пароль"
            autoComplete="new-password"
            required
            placeholder="Не менее 8 символов"
            radius="sm"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />

          <PasswordInput
            label="Повторите пароль"
            autoComplete="new-password"
            required
            placeholder="Повтор пароля"
            radius="sm"
            key={form.key('confirmPassword')}
            {...form.getInputProps('confirmPassword')}
          />

          <Textarea
            label="Описание компании"
            minRows={3}
            autosize
            maxLength={1000}
            placeholder="Что вы продаёте"
            radius="sm"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />

          <Button
            type="submit"
            color="brandBlue"
            fullWidth
            radius="sm"
            mt="sm"
            h={44}
            loading={registerMutation.isPending}
          >
            Создать профиль продавца
          </Button>
        </Stack>
      </form>
    </AuthCardLayout>
  );
}

export default RegisterSellerPage;

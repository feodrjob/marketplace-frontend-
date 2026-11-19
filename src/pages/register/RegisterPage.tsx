import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { Link, useNavigate } from 'react-router-dom';
import { type RegisterBuyerFormValues, registerBuyerSchema } from '@/entities/user';
import { useRegisterBuyerMutation } from '@/features/auth-by-email';
import { getErrorMessage, getValidationErrors } from '@/shared/lib';
import { AuthCardLayout } from '@/shared/ui';

export function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterBuyerMutation();

  const form = useForm<RegisterBuyerFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
    validate: zod4Resolver(registerBuyerSchema),
  });

  const handleSubmit = form.onSubmit((values) => {
    registerMutation.mutate(
      {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || undefined,
        password: values.password,
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
      ? getErrorMessage(registerMutation.error, 'Ошибка при регистрации')
      : null;

  return (
    <AuthCardLayout
      title="Регистрация покупателя"
      subtitle="Создайте аккаунт покупателя и делайте покупки на маркетплейсе"
      footer={
        <Text fz={13} c="dimmed" ta="center" mt="md">
          Уже есть аккаунт?{' '}
          <Anchor component={Link} to="/login" size="sm">
            Войти в аккаунт
          </Anchor>
        </Text>
      }
      belowCard={
        <Stack gap={8} mt="md">
          <Text fz={12} c="dimmed" ta="center">
            Хотите продавать товары?
          </Text>
          <Button component={Link} to="/register/seller" variant="default" radius="sm" h={44}>
            Зарегистрироваться как продавец
          </Button>
        </Stack>
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
            label="Имя и Фамилия"
            autoComplete="name"
            required
            placeholder="Иван Иванов"
            radius="sm"
            key={form.key('fullName')}
            {...form.getInputProps('fullName')}
          />

          <TextInput
            label="Email"
            type="email"
            autoComplete="email"
            required
            placeholder="buyer@t-market.ru"
            radius="sm"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <TextInput
            label="Телефон"
            type="tel"
            autoComplete="tel"
            placeholder="+7 (999) 000-00-00"
            radius="sm"
            key={form.key('phone')}
            {...form.getInputProps('phone')}
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

          <Checkbox
            label="Согласен с правилами сервиса и обработкой данных"
            size="xs"
            mt="xs"
            key={form.key('termsAccepted')}
            {...form.getInputProps('termsAccepted', { type: 'checkbox' })}
          />

          <Button
            type="submit"
            color="brandBlue"
            fullWidth
            radius="sm"
            mt="sm"
            loading={registerMutation.isPending}
          >
            Зарегистрироваться
          </Button>
        </Stack>
      </form>
    </AuthCardLayout>
  );
}

export default RegisterPage;

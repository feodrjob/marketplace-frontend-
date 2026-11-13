import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { type LoginFormValues, loginSchema, useLoginMutation } from '@/entities/user';
import { getErrorMessage, getValidationErrors } from '@/shared/lib';
import { AuthCardLayout } from '@/shared/ui';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();

  const from = (location.state as LocationState | null)?.from?.pathname || '/profile';

  const form = useForm<LoginFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = form.onSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate(from, { replace: true });
      },
      onError: (error) => {
        const details = getValidationErrors(error);
        if (details) {
          form.setErrors(details);
        }
      },
    });
  });

  const nonFieldError =
    loginMutation.isError && !getValidationErrors(loginMutation.error)
      ? getErrorMessage(loginMutation.error, 'Неверный email или пароль')
      : null;

  return (
    <AuthCardLayout
      title="Вход в Т-Маркет"
      subtitle="Войдите в личный кабинет с безопасным JWT-токеном"
      footer={
        <Text fz={13} c="dimmed" ta="center" mt="md">
          Нет аккаунта?{' '}
          <Anchor component={Link} to="/register" size="sm">
            Зарегистрироваться
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
        <Stack gap="md">
          <TextInput
            label="Email"
            type="email"
            required
            placeholder="buyer@t-market.ru"
            radius="sm"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Пароль"
            required
            placeholder="Ваш пароль"
            radius="sm"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />

          <Button
            type="submit"
            color="brandBlue"
            fullWidth
            radius="sm"
            mt="xs"
            loading={loginMutation.isPending}
          >
            Войти
          </Button>
        </Stack>
      </form>
    </AuthCardLayout>
  );
}

export default LoginPage;

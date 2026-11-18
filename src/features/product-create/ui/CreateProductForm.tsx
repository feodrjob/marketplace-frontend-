import { Button, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zod4Resolver } from 'mantine-form-zod-resolver';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_CATEGORY_LABELS, useCreateProductMutation } from '@/entities/product';
import { getErrorMessage, getValidationErrors } from '@/shared/lib';
import { type CreateProductFormValues, createProductSchema } from '../model/schema';

const CATEGORY_OPTIONS = Object.entries(PRODUCT_CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function CreateProductForm() {
  const navigate = useNavigate();
  const createMutation = useCreateProductMutation();

  const form = useForm<CreateProductFormValues>({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      category: CATEGORY_OPTIONS[0]?.value ?? '',
      price: '',
      description: '',
    },
    validate: zod4Resolver(createProductSchema),
  });

  const handleSubmit = form.onSubmit((values) => {
    createMutation.mutate(
      {
        title: values.title.trim(),
        category: values.category,
        price: Number(values.price),
        description: values.description.trim() || undefined,
      },
      {
        onSuccess: (product) => {
          notifications.show({
            color: 'green',
            title: 'Товар создан',
            message: `«${product.title}» опубликован в каталоге`,
          });
          navigate(`/product/${product.id}`);
        },
        onError: (error) => {
          const details = getValidationErrors(error);
          if (details) {
            form.setErrors(details);
            return;
          }
          notifications.show({
            color: 'red',
            title: 'Не удалось создать товар',
            message: getErrorMessage(error, 'Попробуйте повторить позже'),
          });
        },
      }
    );
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        <TextInput
          label="Название"
          required
          maxLength={120}
          placeholder="Например, беспроводные наушники"
          key={form.key('title')}
          {...form.getInputProps('title')}
        />

        <Select
          label="Категория"
          required
          allowDeselect={false}
          data={CATEGORY_OPTIONS}
          key={form.key('category')}
          {...form.getInputProps('category')}
        />

        <TextInput
          label="Цена, ₽"
          required
          inputMode="numeric"
          description="Целое число рублей"
          placeholder="4990"
          key={form.key('price')}
          {...form.getInputProps('price')}
        />

        <Textarea
          label="Описание"
          minRows={4}
          autosize
          maxLength={2000}
          placeholder="Что важно знать покупателю"
          key={form.key('description')}
          {...form.getInputProps('description')}
        />

        <Button type="submit" color="brandBlue" h={44} loading={createMutation.isPending}>
          Опубликовать товар
        </Button>
      </Stack>
    </form>
  );
}

import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Единый акцент бренда Т-Маркет
const brandBlue: MantineColorsTuple = [
  '#f0f6ff',
  '#e0edfe',
  '#b9d8fd',
  '#7cb9fa',
  '#3896f6',
  '#137aeb',
  '#085fc6', // [6] Основной акцентный цвет
  '#074da3', // [7] Hover
  '#094384',
  '#0e386e',
];

export const theme = createTheme({
  primaryColor: 'brandBlue',
  colors: {
    brandBlue,
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '600',
  },
  defaultRadius: 'sm',
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
      },
      styles: {
        root: {
          fontWeight: 500,
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'sm',
      },
    },
  },
});

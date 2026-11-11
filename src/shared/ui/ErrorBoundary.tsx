import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Paper, Title, Text, Button, Stack, Group } from '@mantine/core';
import { getErrorMessage } from '@/shared/lib';

export interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: unknown;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const message = getErrorMessage(
      this.state.error,
      'Произошла непредвиденная ошибка при отображении страницы.'
    );

    return (
      <Container size={480} my={60}>
        <Paper p={28} radius="sm" withBorder bg="white">
          <Stack gap="sm">
            <Text fz={13} fw={600} c="red">
              Ошибка приложения
            </Text>
            <Title order={2} fz={20} fw={600}>
              Не удалось загрузить данные
            </Title>
            <Text fz={14} c="dimmed">
              {message}
            </Text>
            <Group gap="sm" mt="sm">
              <Button color="brandBlue" size="sm" onClick={this.handleReset}>
                Повторить попытку
              </Button>
              <Button component="a" href="/" variant="default" size="sm">
                На главную
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    );
  }
}

export default ErrorBoundary;

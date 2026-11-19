import { Container, Paper, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

export interface AuthCardLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  belowCard?: ReactNode;
}

export function AuthCardLayout({
  title,
  subtitle,
  children,
  footer,
  belowCard,
}: AuthCardLayoutProps) {
  return (
    <Container size={440} my={30}>
      <Title order={1} ta="center" fz={22} fw={600}>
        {title}
      </Title>
      <Text fz={13} c="dimmed" ta="center" mt={4}>
        {subtitle}
      </Text>

      <Paper p={24} radius="sm" withBorder mt={20} bg="white">
        {children}
        {footer}
      </Paper>

      {belowCard}
    </Container>
  );
}

export default AuthCardLayout;

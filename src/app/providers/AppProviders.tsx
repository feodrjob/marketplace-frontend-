import React, { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "@/theme";
import { AuthProvider } from "@/entities/user";

export interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default AppProviders;

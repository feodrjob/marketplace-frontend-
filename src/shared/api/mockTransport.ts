import type { AxiosRequestConfig } from 'axios';
import { ENV } from '@/shared/config';

export type MockResponder = (config: AxiosRequestConfig) => Promise<unknown>;

let responder: MockResponder | null = null;

export function registerMockResponder(next: MockResponder | null): void {
  responder = next;
}

export async function respondWithMock<T>(
  config: AxiosRequestConfig
): Promise<{ handled: true; data: T } | { handled: false }> {
  if (!ENV.USE_MOCKS || !responder) {
    return { handled: false };
  }

  return { handled: true, data: (await responder(config)) as T };
}

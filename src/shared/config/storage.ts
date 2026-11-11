export const ELocalKey = {
  ACCESS_TOKEN: 'access_token',
} as const;

export type LocalStorageKey = (typeof ELocalKey)[keyof typeof ELocalKey];

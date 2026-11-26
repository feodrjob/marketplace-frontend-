const NEW_PRODUCT_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

export function isProductNew(createdAt: string, now: number = Date.now()): boolean {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) {
    return false;
  }

  const age = now - created;
  return age >= 0 && age <= NEW_PRODUCT_DAYS * DAY_MS;
}

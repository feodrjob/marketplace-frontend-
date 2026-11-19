export const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Электроника',
  clothes: 'Одежда',
  home: 'Дом',
};

export function getProductCategoryLabel(category: string): string {
  return PRODUCT_CATEGORY_LABELS[category] ?? category;
}

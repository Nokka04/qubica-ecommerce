/** Format a numeric amount as a USD currency string. */
export function formatPrice(value: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

/** Turn an API category slug into a human-friendly, capitalized label. */
export function formatCategoryLabel(category: string): string {
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

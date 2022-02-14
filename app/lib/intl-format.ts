export const currencyFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const dayFormatter = new Intl.DateTimeFormat([], {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
})

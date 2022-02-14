export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
})

export const dayFormatter = new Intl.DateTimeFormat([], {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
})

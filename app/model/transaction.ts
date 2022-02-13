import { parse } from 'date-fns'
import { toNumber } from 'lodash'
import { z } from 'zod'

const toDate = (value: unknown) => {
  if (value instanceof Date) return value
  return parse(value as string, 'yyyy-MM-dd', new Date())
}

export const transactionSchema = z.object({
  date: z.preprocess(toDate, z.date()),
  exchangeRate: z.preprocess(toNumber, z.number().positive()),
  customer: z.string(),
  operation: z.enum(['COMPRA', 'VENTA']),
  amountUSD: z.preprocess(toNumber, z.number().positive()),
  deltaARS: z.number().positive().optional(),
})

export type Transaction = z.infer<typeof transactionSchema>

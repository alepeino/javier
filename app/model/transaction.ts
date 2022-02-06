import { z } from 'zod'

const schema = z.object({
  date: z.date(),
  buyRate: z.number().positive(),
  sellRate: z.number().positive(),
  customer: z.string(),
  operation: z.enum(['COMPRA', 'VENTA']),
  amountUSD: z.number().positive(),
  effectiveRate: z.number().positive(),
  profitARS: z.number().positive().optional(),
})

export type Transaction = z.infer<typeof schema>

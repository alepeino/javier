import { parse } from 'date-fns'

export const dateInYMD = (date = new Date()) => date.toISOString().slice(0, 10)

export const fromYMD = (asString: string) =>
  parse(asString, 'yyyy-MM-dd', new Date())

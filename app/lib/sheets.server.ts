import { google } from 'googleapis'
import { get, map, pipe, zipObject } from 'lodash/fp'
import invariant from 'tiny-invariant'
import type { Transaction } from '~/model/transaction'

invariant(!!process.env.GOOGLE_AUTH, 'GOOGLE_AUTH missing')
invariant(!!process.env.SPREADSHEET_ID, 'SPREADSHEET_ID missing')

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_AUTH, 'base64').toString('utf8')
)
const jWTClient = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/drive'],
})

const sheets = google.sheets({
  version: 'v4',
  auth: jWTClient,
})

const spreadsheetId = process.env.SPREADSHEET_ID

const HEADERS: Array<keyof Transaction> = [
  'date',
  'exchangeRate',
  'customer',
  'operation',
  'amountUSD',
  'deltaARS',
]

export function read(): Promise<Transaction[]> {
  return sheets.spreadsheets.values
    .get({
      spreadsheetId,
      range: 'a2:h',
      dateTimeRenderOption: 'FORMATTED_STRING',
      valueRenderOption: 'UNFORMATTED_VALUE',
    })
    .then(pipe(get('data.values'), map(zipObject(HEADERS))))
}

export function write(transaction: Transaction) {
  return sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'a:a',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [
        [
          transaction.date.toISOString().slice(0, 10),
          transaction.exchangeRate,
          transaction.customer,
          transaction.operation,
          transaction.amountUSD,
          '=INDIRECT("R[0]C[-1]"; false) * INDIRECT("R[0]C[-4]"; false) * IF(EQ(INDIRECT("R[0]C[-2]"; false); "VENTA"); 1; -1)',
        ],
      ],
    },
  })
}

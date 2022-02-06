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
  'buyRate',
  'sellRate',
  'customer',
  'operation',
  'amountUSD',
  'effectiveRate',
  'profitARS',
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

export function write() {
  return sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'a:a',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [
        [
          new Date(2022, 2, 8).toISOString().slice(0, 10),
          220,
          230,
          'D',
          'VENTA',
          500,
          229,
          '=INDIRECT("R[0]C[-2]"; false) * (MIN(INDIRECT("R[0]C[-5]"; false); INDIRECT("R[0]C[-1]"; false)) - INDIRECT("R[0]C[-6]"; false))',
        ],
      ],
    },
  })
}

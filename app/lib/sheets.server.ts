import { google } from 'googleapis'
import { get, map, pipe, zipObject } from 'lodash/fp'
import invariant from 'tiny-invariant'

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

const HEADERS = [
  'date',
  'buyRate',
  'sellRate',
  'customer',
  'operation',
  'amountUSD',
  'effectiveRate',
  'profitARS',
]

export function read() {
  return sheets.spreadsheets.values
    .get({
      spreadsheetId,
      range: 'a2:h4',
      valueRenderOption: 'UNFORMATTED_VALUE',
    })
    .then(pipe(get('data.values'), map(zipObject(HEADERS))))
}

import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react'
import { addDays, subDays } from 'date-fns/fp'
import { sumBy } from 'lodash/fp'
import type { LoaderFunction } from 'remix'
import { Link, useLoaderData } from 'remix'
import { TransactionTable } from '~/components/TransactionTable'
import { dateInYMD, fromYMD } from '~/lib/date'
import { currencyFormatter, dayFormatter } from '~/lib/intl-format'
import { read } from '~/lib/sheets.server'
import type { Transaction } from '~/model/transaction'

interface LoaderData {
  date: string
  transactions: Transaction[]
}

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.date) {
    throw new Response('Date must be provided', { status: 400 })
  }
  if (!params.date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
    throw new Response('Date must be in YYYY-MM-DD format', { status: 400 })
  }
  try {
    const selectedDate = fromYMD(params.date)
    const transactions = await read(selectedDate)

    return {
      date: params.date,
      transactions,
    }
  } catch (e) {
    throw new Response((e as Error).stack, { status: 500 })
  }
}

export default function TransactionsIndex() {
  const { date, transactions } = useLoaderData<LoaderData>()
  const day = fromYMD(date)
  const dayBefore = subDays(1, day)
  const dayAfter = addDays(1, day)

  const registerHref = `../registrar?date=${date}`

  return (
    <Stack spacing={4}>
      <HStack justifyContent="space-between">
        <Link to={`../${dateInYMD(dayBefore)}`} prefetch="intent">
          <IconButton
            as="span"
            colorScheme="purple"
            aria-label={dayFormatter.format(dayBefore)}
            icon={<ArrowLeftIcon />}
            borderRadius="100%"
          />
        </Link>
        <Heading size="lg" as="h1" aria-describedby="title-description">
          {dayFormatter.format(day)}
        </Heading>
        <Link to={`../${dateInYMD(dayAfter)}`} prefetch="intent">
          <IconButton
            as="span"
            colorScheme="purple"
            aria-label={dayFormatter.format(dayAfter)}
            icon={<ArrowRightIcon />}
            borderRadius="100%"
          />
        </Link>
      </HStack>
      <main>
        {transactions.length ? (
          <Stack spacing={8}>
            <Stat textAlign="center">
              <StatLabel>Total del día (ARS):</StatLabel>
              <StatNumber>
                {currencyFormatter.format(sumBy('deltaARS', transactions))}
              </StatNumber>
              <StatHelpText id="title-description">
                {transactions.length}
                {transactions.length > 1 ? 'transacciones' : 'transacción'}
              </StatHelpText>
            </Stat>

            <Box overflow="auto">
              <TransactionTable transactions={transactions} />
            </Box>
          </Stack>
        ) : (
          <Text id="title-description">
            No hay transacciones registradas en esta fecha
          </Text>
        )}

        <Box display={{ base: 'block', md: 'none' }}>
          <Link to={registerHref}>
            <IconButton
              as="span"
              size="lg"
              colorScheme="primary"
              aria-label="Registrar transacción"
              icon={<AddIcon />}
              borderRadius="100%"
              position="absolute"
              bottom="1rem"
              right="1rem"
            />
          </Link>
        </Box>
        <Box
          display={{ base: 'none', md: 'flex' }}
          mt={4}
          justifyContent="flex-end"
        >
          <Link to={registerHref}>
            <Button as="span" colorScheme="primary">
              Registrar transacción
            </Button>
          </Link>
        </Box>
      </main>
    </Stack>
  )
}

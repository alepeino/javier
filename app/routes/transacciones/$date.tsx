import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, IconButton, Text } from '@chakra-ui/react'
import type { LoaderFunction } from 'remix'
import { Link, useLoaderData } from 'remix'
import { TransactionTable } from '~/components/TransactionTable'
import { fromYMD } from '~/lib/date'
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

  return (
    <>
      <Heading>{date}</Heading>
      <main>
        {transactions.length ? (
          <>
            <Box overflow="auto">
              <TransactionTable transactions={transactions} />
            </Box>
            <Box display={{ base: 'block', md: 'none' }}>
              <Link to="../registrar">
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
              <Link to="../registrar">
                <Button as="span" colorScheme="primary">
                  Registrar transacción
                </Button>
              </Link>
            </Box>
          </>
        ) : (
          <Text>No hay transacciones registradas en esta fecha</Text>
        )}
      </main>
    </>
  )
}

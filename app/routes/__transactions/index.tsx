import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Heading, IconButton } from '@chakra-ui/react'
import type { ActionFunction, LoaderFunction } from 'remix'
import { Link, useLoaderData } from 'remix'
import invariant from 'tiny-invariant'
import { TransactionTable } from '~/components/TransactionTable'
import { read, write } from '~/lib/sheets.server'
import type { Transaction } from '~/model/transaction'

type LoaderData = Transaction[]

export const loader: LoaderFunction = async () => {
  return read()
}

export default function TransactionsIndex() {
  const transactions = useLoaderData<LoaderData>()

  return (
    <>
      <Heading>{new Date().toISOString()}</Heading>
      <main>
        <Box overflow="auto">
          <TransactionTable transactions={transactions} />
        </Box>
        <Box display={{ base: 'block', md: 'none' }}>
          <Link to="registrar">
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
          <Link to="registrar">
            <Button as="span" colorScheme="primary">
              Registrar transacción
            </Button>
          </Link>
        </Box>
      </main>
    </>
  )
}

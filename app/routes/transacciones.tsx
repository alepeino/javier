import { Container } from '@chakra-ui/react'
import { Outlet } from 'remix'

export default function TransactionsLayout() {
  return (
    <Container maxW="xl" pt={4}>
      <Outlet />
    </Container>
  )
}

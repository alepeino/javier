import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  useId,
} from '@chakra-ui/react'
import type { ActionFunction } from 'remix'
import { Form, redirect } from 'remix'
import { dateInYMD } from '~/lib/date'
import { write } from '~/lib/sheets.server'
import { transactionSchema } from '~/model/transaction'

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData()
    const transaction = transactionSchema.parse(Object.fromEntries(formData))
    await write(transaction)
    return redirect('/')
  } catch (e) {
    console.error(e)
    return null
  }
}

export default function RegisterTransactionForm() {
  const formId = useId()

  return (
    <Form method="post">
      <Stack spacing={8}>
        <FormControl isRequired>
          <FormLabel htmlFor={`${formId}-date`}>Fecha</FormLabel>
          <Input
            id={`${formId}-date`}
            name="date"
            type="date"
            defaultValue={dateInYMD()}
          />
        </FormControl>

        <HStack>
          <FormControl isRequired>
            <FormLabel htmlFor={`${formId}-operation`}>
              Tipo de operación
            </FormLabel>
            <Select
              id={`${formId}-operation`}
              placeholder="Seleccionar una"
              name="operation"
            >
              <option value="VENTA">Venta</option>
              <option value="COMPRA">Compra</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor={`${formId}-exchangeRate`}>
              Tipo de cambio
            </FormLabel>
            <Input
              id={`${formId}-exchangeRate`}
              name="exchangeRate"
              type="number"
              min={0}
              step={0.01}
            />
          </FormControl>
        </HStack>

        <FormControl isRequired>
          <FormLabel htmlFor={`${formId}-customer`}>Cliente</FormLabel>
          <Input id={`${formId}-customer`} name="customer" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor={`${formId}-amountUSD`}>Monto (USD)</FormLabel>
          <Input
            id={`${formId}-amountUSD`}
            name="amountUSD"
            type="number"
            min={0}
            step={0.01}
          />
        </FormControl>

        <Button type="submit" colorScheme="primary">
          Guardar
        </Button>
      </Stack>
    </Form>
  )
}

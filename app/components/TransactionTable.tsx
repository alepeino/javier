/* eslint-disable react/jsx-key */
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { chakra, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useMemo } from 'react'
import type { Column } from 'react-table'
import { useSortBy, useTable } from 'react-table'
import type { Transaction } from '~/model/transaction'

interface Props {
  transactions: Transaction[]
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
})

export const TransactionTable = ({ transactions }: Props) => {
  const data = useMemo(() => transactions, [transactions])
  const columns: Column<Transaction>[] = useMemo(() => {
    return [
      {
        Header: 'Cliente',
        accessor: 'customer',
      },
      {
        Header: 'Tipo de operación',
        accessor: 'operation',
      },
      {
        Header: 'Tipo de cambio',
        accessor: 'exchangeRate',
        isNumeric: true,
        Cell: ({ value }) => currencyFormatter.format(value),
      },
      {
        Header: 'Monto (USD)',
        accessor: 'amountUSD',
        isNumeric: true,
        Cell: ({ value }) => currencyFormatter.format(value),
      },
      {
        Header: 'Diferencial (ARS)',
        accessor: 'deltaARS',
        isNumeric: true,
        Cell: ({ value }) => currencyFormatter.format(value!),
      },
    ]
  }, [])
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy)

  return (
    <Table {...getTableProps()} size="sm" colorScheme="primary">
      <Thead>
        {headerGroups.map(headerGroup => (
          <Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                isNumeric={column.isNumeric}
              >
                {column.render('Header')}
                <chakra.span pl="4">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <TriangleDownIcon aria-label="sorted descending" />
                    ) : (
                      <TriangleUpIcon aria-label="sorted ascending" />
                    )
                  ) : null}
                </chakra.span>
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <Tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <Td
                  {...cell.getCellProps()}
                  isNumeric={(cell.column as any).isNumeric}
                >
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

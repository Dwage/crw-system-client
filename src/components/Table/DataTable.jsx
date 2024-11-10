import React, { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, Trash2, Edit } from 'lucide-react'
import { TablePagination } from '@/components/Table/TablePagination'
import { tableConfig } from '@/config/tableConfig'

export const DataTable = ({
  activeTable,
  data,
  loading,
  sortColumn,
  sortDirection,
  handleSort,
  handleDelete,
  handleEdit,
  totalItems,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
}) => {
  const TableHeaders = useMemo(() => {
    return tableConfig[activeTable].columns.map((column) => (
      <TableHead key={column} className="text-center">
        <Button
          variant="ghost"
          onClick={() => handleSort(column)}
          className="flex items-center justify-center w-full h-full py-2"
        >
          {tableConfig[activeTable].displayNames[column]}
          {sortColumn === column &&
            (sortDirection === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            ))}
        </Button>
      </TableHead>
    ))
  }, [activeTable, sortColumn, sortDirection, handleSort])

  const TableRows = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell
            colSpan={tableConfig[activeTable].columns.length + 1}
            className="text-center h-32"
          >
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </TableCell>
        </TableRow>
      )
    }

    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={tableConfig[activeTable].columns.length + 1}
            className="text-center h-32"
          >
            Нет данных
          </TableCell>
        </TableRow>
      )
    }

    return data.map((row) => {
      const rowKey = row.id || row[tableConfig[activeTable].columns[0]]

      return (
        <TableRow key={rowKey}>
          {tableConfig[activeTable].columns.map((column) => (
            <TableCell key={column} className="text-center">
              {row[column]}
            </TableCell>
          ))}
          <TableCell className="text-center">
            <Button
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={() => handleEdit(row)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleDelete(row[tableConfig[activeTable].columns[0]])
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      )
    })
  }, [data, loading, activeTable, handleDelete, handleEdit])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {TableHeaders}
            <TableHead className="text-center">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{TableRows}</TableBody>
      </Table>
      <TablePagination
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        dataLength={data.length}
      />
    </div>
  )
}

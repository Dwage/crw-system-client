import React, { useState, useEffect, useCallback } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReportsDialog } from '@/components/Dialogs/ReportsDialog'
import { tableConfig } from '@/config/tableConfig'
import { api } from '@/services/api'
import { TableControls } from '@/components/Table/TableControls'
import { DataTable } from '@/components/Table/DataTable'
import { FilterDialog } from '@/components/Dialogs/FilterDialog'
import { AddEditDialog } from '@/components/Dialogs/AddEditDialog'

export default function DatabaseInterface() {
  const [activeTable, setActiveTable] = useState('workshops')
  const [data, setData] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState(null)

  const [filters, setFilters] = useState({})
  const [filterDialog, setFilterDialog] = useState(false)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState({})
  const [isReportsDialogOpen, setIsReportsDialogOpen] = useState(false)

  const fetchTableData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.fetchData(activeTable, {
        page: currentPage,
        pageSize,
        sortColumn,
        sortDirection,
        filters,
      })
      setData(response.items)
      setTotalItems(response.totalItems)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [activeTable, currentPage, pageSize, sortColumn, sortDirection, filters])

  useEffect(() => {
    fetchTableData()
  }, [activeTable, currentPage, pageSize, sortColumn, sortDirection, filters])

  const handleTableChange = useCallback((newTable) => {
    setActiveTable(newTable)
    setCurrentPage(1)
    setSortColumn(null)
    setSortDirection(null)
    setFilters({})
  }, [])

  const handleSort = useCallback(
    (column) => {
      setSortDirection((prevDirection) => {
        if (sortColumn !== column) return 'asc'
        return prevDirection === 'asc' ? 'desc' : 'asc'
      })
      setSortColumn(column)
    },
    [sortColumn]
  )

  const handleFilter = useCallback((column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }))
    setCurrentPage(1)
  }, [])

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
        try {
          await api.deleteItem(activeTable, id)
          await fetchTableData()
        } catch (err) {
          setError(err.message)
        }
      }
    },
    [activeTable, fetchTableData]
  )

  const handleAdd = useCallback(async () => {
    try {
      await api.createItem(activeTable, newItem)
      setNewItem({})
      setIsAddDialogOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }, [activeTable, newItem])

  const handleEdit = useCallback(async () => {
    if (!editingItem) return
    try {
      const idField = tableConfig[activeTable].columns[0]
      await api.updateItem(activeTable, editingItem[idField], editingItem)
      setEditingItem(null)
    } catch (err) {
      setError(err.message)
    }
  }, [activeTable, editingItem])

  return (
    <div className="p-6">
      <TableControls
        activeTable={activeTable}
        handleTableChange={handleTableChange}
        setFilterDialog={setFilterDialog}
        setIsAddDialogOpen={setIsAddDialogOpen}
        setIsReportsDialogOpen={setIsReportsDialogOpen}
      />

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <DataTable
        activeTable={activeTable}
        data={data}
        loading={loading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
        handleDelete={handleDelete}
        handleEdit={setEditingItem}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />

      <FilterDialog
        open={filterDialog}
        setOpen={setFilterDialog}
        activeTable={activeTable}
        handleFilter={handleFilter}
      />

      <AddEditDialog
        open={isAddDialogOpen || !!editingItem}
        setOpen={(open) => {
          if (!open) {
            if (editingItem) {
              setEditingItem(null)
            } else {
              setIsAddDialogOpen(false)
            }
          }
        }}
        activeTable={activeTable}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        newItem={newItem}
        setNewItem={setNewItem}
        handleAdd={handleAdd}
        handleEdit={handleEdit}
        fetchTableData={fetchTableData}
      />

      <Dialog open={isReportsDialogOpen} onOpenChange={setIsReportsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Отчеты</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col">
            <div className="flex flex-col max-h-[80vh] overflow-y-auto space-y-8">
              <ReportsDialog />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

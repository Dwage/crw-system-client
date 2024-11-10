import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'

const reportTypes = {
  repairCosts: {
    name: 'Стоимость ремонта автомобилей',
    endpoint: '/api/reports/repair-costs',
    filters: [
      { name: 'owner', type: 'text', label: 'Владелец' },
      { name: 'carId', type: 'number', label: 'ID автомобиля' },
      {
        name: 'dateRange',
        type: 'dateRange',
        label: 'Период ремонта',
        startName: 'startDate',
        endName: 'endDate',
      },
    ],
    sortOptions: [
      { value: 'totalPrice', label: 'Стоимость' },
      { value: 'startDate', label: 'Дата начала' },
      { value: 'endDate', label: 'Дата окончания' },
    ],
    columns: [
      { key: 'owner', label: 'Владелец' },
      { key: 'carId', label: 'ID автомобиля' },
      { key: 'startDate', label: 'Дата начала' },
      { key: 'endDate', label: 'Дата окончания' },
      { key: 'totalPrice', label: 'Общая стоимость' },
    ],
  },
  laborPerformance: {
    name: 'Производительность труда',
    endpoint: '/api/reports/labor-performance',
    filters: [],
    sortOptions: [
      { value: 'RepairsCount', label: 'Количество ремонтов' },
      { value: 'TotalDaysSpent', label: 'Всего затрачено дней' },
      { value: 'AvgDaysPerOrder', label: 'Среднее количество дней на заказ' },
    ],
    columns: [
      { key: 'teamName', label: 'Название бригады' },
      { key: 'repairsCount', label: 'Количество ремонтов' },
      { key: 'totalDaysSpent', label: 'Всего затрачено дней' },
      { key: 'avgDaysPerOrder', label: 'Среднее количество дней на заказ' },
    ],
  },
  malfunctionFrequency: {
    name: 'Частота неисправностей',
    endpoint: '/api/reports/malfunction-frequency',
    filters: [
      { name: 'brand', type: 'text', label: 'Марка' },
      { name: 'model', type: 'text', label: 'Модель' },
    ],
    sortOptions: [
      { value: 'TotalRepairs', label: 'Общее количество ремонтов' },
    ],
    columns: [
      { key: 'malfunctionName', label: 'Название неисправности' },
      { key: 'brand', label: 'Марка' },
      { key: 'model', label: 'Модель' },
      { key: 'totalRepairs', label: 'Общее количество ремонтов' },
    ],
  },
}

export function ReportsDialog() {
  const [selectedReport, setSelectedReport] = useState('')
  const [filters, setFilters] = useState({})
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const fetchReport = async () => {
    if (!selectedReport) return

    setLoading(true)
    setError(null)

    const queryParams = new URLSearchParams({
      ...filters,
      sortColumn,
      sortDirection,
    })

    try {
      const response = await fetch(
        `https://localhost:7000${reportTypes[selectedReport].endpoint}?${queryParams}`
      )
      if (!response.ok) throw new Error('Failed to fetch report')
      const data = await response.json()
      setReportData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderFilters = () => {
    if (!selectedReport) return null

    const reportConfig = reportTypes[selectedReport]

    return (
      <div className="grid grid-cols-2 gap-4 mb-4">
        {reportConfig.filters.map((filter) => (
          <div key={filter.name} className="space-y-2">
            <Label>{filter.label}</Label>
            {filter.type === 'dateRange' ? (
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  onChange={(e) =>
                    handleFilterChange(filter.startName, e.target.value)
                  }
                />
                <Input
                  type="date"
                  onChange={(e) =>
                    handleFilterChange(filter.endName, e.target.value)
                  }
                />
              </div>
            ) : (
              <Input
                type={filter.type}
                onChange={(e) =>
                  handleFilterChange(filter.name, e.target.value)
                }
              />
            )}
          </div>
        ))}
        <div className="space-y-2">
          <Label>Сортировать по</Label>
          <Select onValueChange={setSortColumn}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите поле" />
            </SelectTrigger>
            <SelectContent>
              {reportConfig.sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Направление сортировки</Label>
          <Select value={sortDirection} onValueChange={setSortDirection}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">По возрастанию</SelectItem>
              <SelectItem value="desc">По убыванию</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const renderResults = () => {
    if (!reportData || !reportData.items || reportData.items.length === 0)
      return null

    const reportConfig = reportTypes[selectedReport]

    return (
      <div className="space-y-4 mt-8">
        {reportData.totalSum && (
          <div className="text-right text-lg font-bold">
            Итого: {reportData.totalSum.toFixed(2)} ₽
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              {reportConfig.columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.items.map((item, index) => (
              <TableRow key={index}>
                {reportConfig.columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.key.includes('Date')
                      ? item[column.key]
                        ? format(new Date(item[column.key]), 'dd.MM.yyyy')
                        : '—'
                      : column.key === 'totalPrice'
                      ? (item[column.key] || 0).toFixed(2)
                      : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Тип отчета</Label>
        <Select value={selectedReport} onValueChange={setSelectedReport}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите тип отчета" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(reportTypes).map(([key, report]) => (
              <SelectItem key={key} value={key}>
                {report.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {renderFilters()}

      <Button
        onClick={fetchReport}
        disabled={!selectedReport || loading}
        className="w-full"
      >
        {loading ? 'Загрузка...' : 'Сформировать отчет'}
      </Button>

      {error && (
        <div className="text-red-500">Ошибка при получении отчета: {error}</div>
      )}

      {renderResults()}
    </div>
  )
}

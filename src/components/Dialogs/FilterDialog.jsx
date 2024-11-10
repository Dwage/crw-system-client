import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { tableConfig } from '@/config/tableConfig'

export const FilterDialog = ({ open, setOpen, activeTable, handleFilter }) => {
  const [localFilters, setLocalFilters] = useState({})
  const [localFilterTypes, setLocalFilterTypes] = useState({})

  const handleInputChange = (column, value) => {
    setLocalFilters((prev) => ({ ...prev, [column]: value }))
  }

  const handleFilterTypeChange = (column, value) => {
    setLocalFilterTypes((prev) => ({ ...prev, [column]: value }))
  }

  const applyFilters = () => {
    for (const column in localFilters) {
      handleFilter(column, localFilters[column])
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Фильтры</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {tableConfig[activeTable].columns.map((column) => (
            <div key={column} className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">
                {tableConfig[activeTable].displayNames[column]}
              </label>

              {tableConfig[activeTable].dataTypes[column] === 'number' ? (
                <>
                  <select
                    value={localFilterTypes[column] || 'in'}
                    onChange={(e) =>
                      handleFilterTypeChange(column, e.target.value)
                    }
                    className="col-span-3"
                  >
                    <option key="in" value="in">
                      Конкретные значения
                    </option>
                    <option ket="range" value="range">
                      Диапазон
                    </option>
                  </select>

                  {localFilterTypes[column] === 'range' ? (
                    <div className="col-span-3 grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Min"
                        value={localFilters[`${column}_min`] || ''}
                        onChange={(e) =>
                          handleInputChange(`${column}_min`, e.target.value)
                        }
                      />
                      <Input
                        placeholder="Max"
                        value={localFilters[`${column}_max`] || ''}
                        onChange={(e) =>
                          handleInputChange(`${column}_max`, e.target.value)
                        }
                      />
                    </div>
                  ) : (
                    <Input
                      placeholder="Введите значения через запятую"
                      value={localFilters[`${column}_in`] || ''}
                      onChange={(e) =>
                        handleInputChange(`${column}_in`, e.target.value)
                      }
                      className="col-span-3"
                    />
                  )}
                </>
              ) : (
                <Input
                  placeholder="Введите значения через запятую"
                  value={localFilters[column] || ''}
                  onChange={(e) => handleInputChange(column, e.target.value)}
                  className="col-span-3"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={applyFilters}>Применить</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { tableConfig } from '@/config/tableConfig'
import { Plus } from 'lucide-react'
export const TableControls = ({
  activeTable,
  handleTableChange,
  setFilterDialog,
  setIsAddDialogOpen,
  setIsReportsDialogOpen,
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex gap-2">
        <Select value={activeTable} onValueChange={handleTableChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Выберите таблицу" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(tableConfig).map((table) => (
              <SelectItem key={table} value={table}>
                {table.charAt(0).toUpperCase() + table.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsReportsDialogOpen(true)}
          >
            Отчеты
          </Button>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setFilterDialog(true)}>
          Фильтры
        </Button>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Добавить
        </Button>
      </div>
    </div>
  )
}

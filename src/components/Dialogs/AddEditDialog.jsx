import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { tableConfig } from '@/config/tableConfig'
import { api } from '@/services/api'

export const AddEditDialog = ({
  open,
  setOpen,
  activeTable,
  editingItem,
  setEditingItem,
  newItem,
  setNewItem,
  handleAdd,
  handleEdit,
  fetchTableData,
}) => {
  const isEditing = !!editingItem
  const dialogTitle = isEditing
    ? 'Редактировать запись'
    : 'Добавить новую запись'
  const [localItem, setLocalItem] = useState(isEditing ? editingItem : newItem)
  const [errors, setErrors] = useState({})
  const idField = tableConfig[activeTable].columns[0]
  const [teamMembers, setTeamMembers] = useState([])

  const initialMemberState = {
    personInn: '',
    fullName: '',
    position: '',
    salary: '',
    hireDate: '',
  }

  useEffect(() => {
    setLocalItem(isEditing ? editingItem : newItem)
    setErrors({})
    setTeamMembers([])
  }, [isEditing, editingItem, newItem])

  const handleChange = useCallback(
    async (column, value) => {
      if (isEditing && column === idField) return

      setLocalItem((prevState) => ({ ...prevState, [column]: value }))
      setErrors((prevErrors) => ({ ...prevErrors, [column]: undefined }))

      if (!isEditing && column === idField) {
        const newId = parseInt(value, 10)
        if (isNaN(newId)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [column]: 'Неверный формат числа',
          }))
          return
        }
      }
    },
    [isEditing, activeTable, idField]
  )

  const handleAddMember = () => {
    setTeamMembers((prev) => [...prev, { ...initialMemberState }])
  }

  const handleRemoveMember = (index) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index))
  }

  const handleMemberChange = (index, field, value) => {
    setTeamMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    )
  }

  const handleSave = async () => {
    let validationErrors = {}
    let itemToSend = { ...localItem }
    const dataTypes = tableConfig[activeTable].dataTypes
    const idField = tableConfig[activeTable].columns[0]

    for (const column in dataTypes) {
      if (dataTypes[column] === 'number') {
        const numValue = parseInt(itemToSend[column], 10)
        if (isNaN(numValue)) {
          validationErrors[column] = 'Неверный формат числа'
        } else {
          itemToSend[column] = numValue
        }
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      if (isEditing) {
        await api.updateItem(activeTable, editingItem[idField], itemToSend)
        setEditingItem(null)
      } else {
        if (activeTable === 'teams') {
          await api.createItem(activeTable, {
            ...itemToSend,
            members: teamMembers,
          })
        } else {
          await api.createItem(activeTable, itemToSend)
        }
        setNewItem({})
      }
      setOpen(false)
      await fetchTableData()
    } catch (error) {
      console.error('API error:', error)

      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors)
      } else {
        setErrors({
          general: 'Failed to save item. Check console for details.',
        })
      }
    }
  }

  function handleDialogClose(open) {
    if (!open) {
      setErrors({})
      setTeamMembers([])
      if (isEditing) {
        setEditingItem(null)
      } else {
        setOpen(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {tableConfig[activeTable].columns.map((column) => (
            <div key={column} className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">
                {tableConfig[activeTable].displayNames[column]}
              </label>
              <div className="col-span-3 relative">
                <Input
                  value={localItem[column] || ''}
                  onChange={(e) => handleChange(column, e.target.value)}
                  className="w-full"
                  disabled={isEditing && column === idField}
                  style={{
                    backgroundColor:
                      isEditing && column === idField ? '#eee' : 'white',
                  }}
                />
                {errors[column] && (
                  <p className="text-red-500 text-sm absolute -bottom-5 left-0">
                    {errors[column]}
                  </p>
                )}
              </div>
            </div>
          ))}
          {activeTable === 'teams' && !isEditing && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Сотрудники бригады</h3>
                <Button onClick={handleAddMember} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Добавить сотрудника
                </Button>
              </div>
              {teamMembers.map((member, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Сотрудник {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    {Object.entries(initialMemberState).map(([field, _]) => (
                      <div
                        key={field}
                        className="grid grid-cols-4 items-center gap-4"
                      >
                        <label className="text-right">
                          {tableConfig.staff.displayNames[field]}
                        </label>
                        <div className="col-span-3">
                          <Input
                            value={member[field]}
                            onChange={(e) =>
                              handleMemberChange(index, field, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>
            {isEditing ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

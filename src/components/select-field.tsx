// components/SelectField.tsx
import { Dispatch, FC, SetStateAction } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DynamicAddModal from './add-items-modal'

interface SelectFieldProps {
  id: string
  label?: string
  value: any
  isLoading?: boolean
  onChange: (selectedObject: any) => void
  options: any[]
  addModalOpen: boolean
  setAddModalOpen: Dispatch<SetStateAction<boolean>>
  itemType: string
  placeholder?: string
}

const SelectField: FC<SelectFieldProps> = ({
  id,
  placeholder,
  label,
  value,
  onChange,
  options,
  addModalOpen,
  setAddModalOpen,
  itemType,
  isLoading = false,
}) => {
  const nameField = `${id}Name`

  return (
    <>
      <Label htmlFor={id} className='text-sm font-medium dark:text-black'>
        {label}
      </Label>
      <div className='relative'>
        {isLoading ? (
          <p className='text-xs text-muted'>Loading..</p>
        ) : (
          <Select
            value={value?._id}
            onValueChange={(selectedId) => {
              const selectedOption = options.find(
                (option) => option._id === selectedId
              )
              onChange(selectedOption)
            }}
          >
            <SelectTrigger className='text-xs'>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  className='capitalize'
                  key={option._id}
                  value={option._id}
                >
                  {option[nameField]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <DynamicAddModal
          plusButton={true}
          itemType={itemType}
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
        />
      </div>
    </>
  )
}

export default SelectField

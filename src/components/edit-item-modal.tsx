import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PhoneInput } from 'react-international-phone'
import { toast } from 'sonner'
import InputField from './input-field'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

interface Field {
  key: string
  label: string
  placeholder?: string
  type?: string
}

interface DynamicEditModalProps {
  itemType: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: Record<string, string>
  itemId: string
}

const API_URL = import.meta.env.VITE_API_URL

const DynamicEditModal: FC<DynamicEditModalProps> = ({
  itemType,
  open,
  onOpenChange,
  initialData,
  itemId,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(initialData)
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient()

  useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const invalidatingQueries = () => {
    const queryKeyMap: Record<string, string> = {
      category: 'category',
      unit: 'unit',
      section: 'section',
    }

    const keyToInvalidate = queryKeyMap[itemType]

    if (keyToInvalidate) {
      queryClient.invalidateQueries({ queryKey: [keyToInvalidate] })
    }
  }

  const dynamicFields: Field[] = useMemo(() => {
    const commonField = {
      key: `${itemType}Name`,
      label: `${itemType} Name`,
      placeholder: `Enter ${itemType} name`,
    }

    const extraFields: Record<string, Field[]> = {
      unit: [
        {
          key: 'unitSymbol',
          label: 'Unit Symbol',
          placeholder: 'Enter unit symbol',
        },
      ],
      shop: [
        { key: 'country', label: 'Country', placeholder: 'Enter country' },
        {
          key: 'address',
          label: 'Shop Location',
          placeholder: 'Enter address',
        },
        {
          key: 'phoneNumber',
          label: 'Shop Phone Number',
          placeholder: 'Enter phone number',
        },
      ],
    }

    return [commonField, ...(extraFields[itemType] || [])]
  }, [itemType])

  const mutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      const response = await axios.put(
        `${API_URL}/${itemType}/${itemId}`,
        data,
        {
          withCredentials: true,
        }
      )
      return response.data
    },
    onSuccess: () => {
      toast.success(`${itemType} updated successfully`)
      onOpenChange(false)
      invalidatingQueries()
    },
    onError: () => {
      toast.error(`Failed to update ${itemType}`)
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: e.target.value,
    }))
  }

  const handleSubmit = () => {
    setLoading(true)
    mutation.mutate(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold capitalize'>
            Edit {itemType}
          </DialogTitle>
          <DialogDescription>
            Update the details for this {itemType}.
          </DialogDescription>
        </DialogHeader>

        {mutation.isPending ? (
          <div className='flex h-32 items-center justify-center'>
            <p className='text-xs text-muted-foreground'>Loading ...</p>
          </div>
        ) : (
          <form className='grid gap-4 py-4'>
            {dynamicFields.map((field) => (
              <div key={field.key}>
                {field.key === 'phoneNumber' ? (
                  <div className='grid gap-2'>
                    <label
                      htmlFor={field.key}
                      className='text-sm font-medium capitalize'
                    >
                      {field.label}
                    </label>
                    <PhoneInput
                      defaultCountry='ke'
                      value={formData[field.key]}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.key]: value,
                        }))
                      }
                      className='input w-full'
                    />
                  </div>
                ) : (
                  <InputField
                    id={field.key}
                    label={field.label}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    onChange={(e) => handleChange(e, field.key)}
                    value={formData[field.key]}
                  />
                )}
              </div>
            ))}

            <Button
              className='capitalize'
              type='button'
              size='sm'
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Saving...' : `Update ${itemType}`}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DynamicEditModal

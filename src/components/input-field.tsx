import { ChangeEvent, FC } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InputFieldProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  value?: string | number // Add this line to declare the value prop
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const InputField: FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}) => (
  <div className='grid grid-cols-3'>
    <Label
      htmlFor={id}
      className={`${
        required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ''
      } col-span-1 flex h-full items-center text-sm font-medium capitalize`}
    >
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`${id === 'email' ? '' : 'capitalize'} col-span-2 m-0`}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
)

export default InputField

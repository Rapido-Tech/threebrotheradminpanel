import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
// Ensure styles are imported
import { isPhoneValid } from '@/utils/helper-functions'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SignUpData } from './sign-up-form'

// 1. Zod schema
const schema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phoneNumber: z
    .string()
    .refine(isPhoneValid, { message: 'Invalid phone number' }),
})

type FormValues = z.infer<typeof schema>

type Props = {
  data: SignUpData
  onNext: (data: Partial<SignUpData>) => void
}

export default function StepOne({ data, onNext }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      firstname: data.firstname,
      lastname: data.lastname,
    },
  })

  const handleSubmit = (values: FormValues) => {
    onNext(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='firstname'
          render={({ field }) => (
            <FormItem className='text-xs'>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder='John' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastname'
          render={({ field }) => (
            <FormItem className='text-xs'>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder='Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem className='text-xs'>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry='ke'
                  value={field.value}
                  onChange={field.onChange}
                  className='input relative w-full'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='text-xs'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full'>
          Next
        </Button>
      </form>
    </Form>
  )
}

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserData, userSchema } from '@/data/types'
import { PhoneInput } from 'react-international-phone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfileFormProps {
  setCurrentStep: (value: number | ((prev: number) => number)) => void
  collectedUserData: UserData | null
  setCollectedUserData: (data: UserData | null) => void
}

export default function UserDetailsForm({
  setCurrentStep,
  collectedUserData,
  setCollectedUserData,
}: ProfileFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: collectedUserData?.firstname || '',
      lastname: collectedUserData?.lastname || '',
      username: collectedUserData?.username || '',
      phone: collectedUserData?.phone || '',
    },
  })

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const onSubmit = (data: UserData) => {
    setCollectedUserData(data)
    setCurrentStep(3)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      <div className='grid gap-4'>
        {/* First Name Field */}
        <div>
          <Label htmlFor='firstname'>First Name</Label>
          <div
            className={`${errors.firstname ? 'animate-shake' : ''} relative`}
          >
            <Controller
              control={control}
              name='firstname'
              render={({ field }) => (
                <Input
                  id='firstname'
                  placeholder='Enter First Name'
                  {...field}
                  className={`${errors.firstname ? 'border-red-500' : ''} capitalize`}
                />
              )}
            />
            {errors.firstname && (
              <span className='text-xs text-red-500'>
                {errors.firstname.message}
              </span>
            )}
          </div>
        </div>

        {/* Second Name Field */}
        <div>
          <Label htmlFor='lastname'>Second Name</Label>
          <div className={`${errors.lastname ? 'animate-shake' : ''} relative`}>
            <Controller
              control={control}
              name='lastname'
              render={({ field }) => (
                <Input
                  id='lastname'
                  placeholder='Enter Second Name'
                  {...field}
                  className={`${errors.lastname ? 'border-red-500' : ''} capitalize`}
                />
              )}
            />
            {errors.lastname && (
              <span className='text-xs text-red-500'>
                {errors.lastname.message}
              </span>
            )}
          </div>
        </div>

        {/* User Name Field */}
        <div>
          <Label htmlFor='username'>User Name</Label>
          <div className={`${errors.username ? 'animate-shake' : ''} relative`}>
            <Controller
              control={control}
              name='username'
              render={({ field }) => (
                <Input
                  id='username'
                  placeholder='Enter User Name'
                  {...field}
                  className={`${errors.username ? 'border-red-500' : ''} capitalize`}
                />
              )}
            />
            {errors.username && (
              <span className='text-xs text-red-500'>
                {errors.username.message}
              </span>
            )}
          </div>
        </div>

        {/* Phone Number Field */}
        <div>
          <Label htmlFor='phone'>Phone Number</Label>
          <div className={`${errors.phone ? 'animate-shake' : ''} relative`}>
            <Controller
              control={control}
              name='phone'
              render={({ field }) => (
                <div className='relative'>
                  <PhoneInput
                    defaultCountry='ke'
                    value={field.value}
                    onChange={field.onChange}
                    className='input w-full'
                  />
                </div>
              )}
            />
            {errors.phone && (
              <span className='text-xs text-red-500'>
                {errors.phone?.message ?? 'Phone number is invalid'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className='col-span-2 flex w-full justify-between'>
        <Button onClick={handleBack} variant='outline' type='button'>
          Back
        </Button>
        <div className='flex w-full justify-end'>
          <Button type='submit'>Next</Button>
        </div>
      </div>
    </form>
  )
}

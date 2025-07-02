import { useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StoreData, storeSchema } from '@/data/types'
import { PhoneInput } from 'react-international-phone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ShopDetailsFormProps {
  onSubmit: (data: StoreData) => void
  setCurrentStep: (value: number | ((prev: number) => number)) => void
  collectedStoreData: StoreData | null
  setCollectedStoreData: (data: StoreData) => void
}

export default function ShopDetailsForm({
  onSubmit,
  collectedStoreData,
  setCurrentStep,
  setCollectedStoreData,
}: ShopDetailsFormProps) {
  const normalizedData: StoreData = {
    storename: collectedStoreData?.storename ?? '',
    address: collectedStoreData?.address ?? '',
    country: collectedStoreData?.country ?? '',
    storephoneNo: collectedStoreData?.storephoneNo ?? '',
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreData>({
    resolver: zodResolver(storeSchema),
    defaultValues: normalizedData,
  })

  // ✅ Watch for changes and update collected data
  const watchedValues = useWatch({ control })

  useEffect(() => {
    setCollectedStoreData(watchedValues as StoreData)
  }, [watchedValues, setCollectedStoreData])

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
      <div className='grid gap-4'>
        {/* Shop Name */}
        <div>
          <Label htmlFor='storename'>Shop Name</Label>
          <Controller
            control={control}
            name='storename'
            render={({ field }) => (
              <Input
                id='storename'
                placeholder='Enter Shop Name'
                {...field}
                className={
                  errors.storename ? 'border-red-500 capitalize' : 'capitalize'
                }
              />
            )}
          />
          {errors.storename && (
            <span className='text-xs text-red-500'>
              {errors.storename.message}
            </span>
          )}
        </div>

        {/* Address */}
        <div>
          <Label htmlFor='address'>Address</Label>
          <Controller
            control={control}
            name='address'
            render={({ field }) => (
              <Input
                id='address'
                placeholder='Enter Address'
                {...field}
                className={
                  errors.address ? 'border-red-500 capitalize' : 'capitalize'
                }
              />
            )}
          />
          {errors.address && (
            <span className='text-xs text-red-500'>
              {errors.address.message}
            </span>
          )}
        </div>

        {/* Country */}
        <div>
          <Label htmlFor='country'>Country</Label>
          <Controller
            control={control}
            name='country'
            render={({ field }) => (
              <Input
                id='country'
                placeholder='Enter Country'
                {...field}
                className={
                  errors.country ? 'border-red-500 capitalize' : 'capitalize'
                }
              />
            )}
          />
          {errors.country && (
            <span className='text-xs text-red-500'>
              {errors.country.message}
            </span>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor='storephoneNo'>Shop Contact</Label>
          <Controller
            control={control}
            name='storephoneNo'
            render={({ field }) => (
              <PhoneInput
                defaultCountry='ke'
                value={field.value}
                onChange={field.onChange}
                className='input w-full'
              />
            )}
          />
          {errors.storephoneNo && (
            <span className='text-xs text-red-500'>
              {errors.storephoneNo.message || 'Phone number is invalid'}
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className='col-span-2 flex w-full justify-between'>
        <Button onClick={handleBack} variant='outline' type='button'>
          Back
        </Button>
        <div className='flex w-full justify-end'>
          <Button type='submit'>Submit</Button>
        </div>
      </div>
    </form>
  )
}

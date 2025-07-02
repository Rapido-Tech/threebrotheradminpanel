import { ChangeEvent, FormEvent } from 'react'
import { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { OnBoardingFormData } from '@/data/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'

type FormField = {
  fieldName: keyof OnBoardingFormData
  label: string
  type?: string
}

interface AuthFormStepProps {
  formData: OnBoardingFormData
  isOtp?: boolean
  setFormData: (value: OnBoardingFormData) => void
  setCurrentStep: (value: number | ((prev: number) => number)) => void
  errors: { [key: string]: string }
  onSubmit: (event: FormEvent) => void
  isLoading: boolean
  fields: FormField[]
  currentStep: number
  backButton?: boolean
  register?: UseFormRegister<OnBoardingFormData>
  setValue?: UseFormSetValue<OnBoardingFormData>
}

export const AuthFormStep = ({
  formData,
  setFormData,
  errors,
  onSubmit,
  isLoading,
  fields,
  setCurrentStep,
  currentStep,
  isOtp = false,
  backButton = true,
}: AuthFormStepProps) => {
  // Always call hooks at the top level of the component
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const handleInputChange = (
    field: keyof OnBoardingFormData,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value })
  }

  const renderOtpInput = () => (
    <>
      <Label className='w-full text-center' htmlFor='verificationCode'>
        Enter Verification Code
      </Label>
      <div
        className={`${
          errors.verificationCode ? 'animate-shake' : ''
        } relative w-full text-center`}
      >
        <div className='flex flex-col items-center justify-center gap-2 py-2'>
          <InputOTP
            maxLength={6}
            value={formData.verificationCode}
            onChange={(val: string) =>
              handleInputChange('verificationCode', val)
            }
          >
            <InputOTPGroup>
              {[0, 1, 2].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
            <InputOTPGroup>
              {[3, 4, 5].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        {errors.verificationCode && (
          <span className='text-xs text-red-500'>
            {errors.verificationCode}
          </span>
        )}
      </div>
    </>
  )

  const renderFormFields = () =>
    fields.map(({ fieldName, label, type = 'text' }) => (
      <div key={fieldName} className='flex w-full flex-col space-y-1.5'>
        <Label htmlFor={fieldName}>{label}</Label>
        <Input
          id={fieldName}
          name={fieldName}
          type={type}
          className={`${errors[fieldName] ? 'border-red-500' : ''} w-full`}
          value={formData[fieldName] ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(fieldName, e.target.value)
          }
        />
        {errors[fieldName] && (
          <span className='text-xs text-red-500'>{errors[fieldName]}</span>
        )}
      </div>
    ))

  return (
    <form onSubmit={onSubmit}>
      <div className='flex w-full flex-col items-center gap-4'>
        {/* This is where conditional rendering happens but doesn't affect hooks */}
        {isOtp ? renderOtpInput() : renderFormFields()}

        <div className='col-span-2 flex w-full justify-between'>
          {currentStep > 0 && backButton && (
            <Button onClick={handleBack} variant='outline' type='button'>
              Back
            </Button>
          )}
          <div className='flex w-full justify-end'>
            <Button type='submit' disabled={isLoading}>
              {currentStep === 4 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

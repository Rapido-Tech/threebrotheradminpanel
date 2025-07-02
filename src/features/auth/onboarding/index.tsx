import { FormEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { useForm, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { StoreData, OnBoardingFormData } from '@/data/types'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { useShopStore } from '@/stores/shopStore'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { AuthFormStep } from './components/AuthFormSteps'
import ShopDetailsForm from './components/ShopDetailsForm'
//import UserDetailsForm from './components/UserDetailsForm'
import { onboardingSchema } from './data/schema'

const API_URL = import.meta.env.VITE_API_URL

const saveUserInfo = async (data: {
  email: string
  phone?: string
  storename: string
  address: string
  storephoneNo: string
  country: string
}) => {
  try {
    const res = await axios.post(`${API_URL}/onboarding`, data, {
      withCredentials: true,
    })
    return res.data.user
  } catch (error) {
    console.error('Saving user info failed:', error)
    throw error
  }
}

// ✅ Utility to parse errors safely
const parseErrors = (
  fieldErrors: FieldErrors<OnBoardingFormData>
): Record<string, string> => {
  const result: Record<string, string> = {}

  for (const key in fieldErrors) {
    const fieldError = fieldErrors[key as keyof OnBoardingFormData]
    if (fieldError && typeof fieldError.message === 'string') {
      result[key] = fieldError.message
    }
  }

  return result
}

const resendCode = async () => {
  return axios
    .get(`${API_URL}/resend-code`, {
      withCredentials: true,
    })
    .then((response) => {
      console.log(response)
      return response.data
    })
    .catch((err) => {
      console.error(err)
      throw new Error('Failed to fetch shops')
    })
}

export default function Onboarding() {
  const verifyEmailMutation = useMutation({
    mutationFn: async ({
      email,
      verificationCode,
    }: {
      email: string
      verificationCode: string
    }) => {
      const res = await axios.post(
        `${API_URL}/verify-email`,
        { email, verificationCode },
        { withCredentials: true }
      )
      return res.data
    },
  })

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [countDown, setCountDown] = useState<number>(0)

  const [collectedStoreData, setCollectedStoreData] =
    useState<StoreData | null>(null)

  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore.getState().setUser
  const setActiveShopId = useShopStore.getState().setActiveShopId
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState<OnBoardingFormData>({
    verificationCode: '',
    username: '',
    firstname: '',
    lastname: '',
    storename: '',
    storephoneNo: '',
    address: '',
    country: '',
    phone: '',
  })

  const {
    register,
    formState: { errors },
    setValue,
  } = useForm<OnBoardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      verificationCode: '',
      firstname: '',
      lastname: '',
      username: '',
      phone: '',
      email: '',
      storename: '',
      storephoneNo: '',
      address: '',
      country: '',
    },
  })

  useEffect(() => {
    if (!user) return

    if (user.isVerified) {
      setCurrentStep(user.storeIds?.length === 0 ? 2 : 1)
    } else {
      setCurrentStep(1)
    }
  }, [user, setValue])

  const handleNext = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (currentStep === 1) {
        const response = await verifyEmailMutation.mutateAsync({
          email: user?.email || '',
          verificationCode: formData.verificationCode,
        })

        setUser(response.user)
        setCurrentStep(2)
      }
    } catch (error) {
      console.error('Error during verification:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const handleShopDetailFormSubmit = async (data: StoreData) => {
    const toastId = toast.loading('Creating account...')

    if (!user?.email && !user?.phone) {
      toast.error(
        'Both email and phone are missing. Please provide at least one.',
        { id: toastId }
      )
      return
    }

    try {
      const newUser = await saveUserInfo({
        email: user?.email ?? '',
        storename: data.storename,
        phone: user.phone ?? '',
        address: data.address,
        storephoneNo: data.storephoneNo,
        country: data.country,
      })

      toast.success('Account created successfully', { id: toastId })

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      await delay(3000)

      setUser(newUser)

      const { shopIds, defaultShopId } = newUser

      if (Array.isArray(shopIds)) {
        if (shopIds.length === 1) {
          setActiveShopId(shopIds[0])
        } else if (defaultShopId) {
          setActiveShopId(defaultShopId)
        } else {
          navigate({ to: '/shop-selection', replace: true })
          return
        }
      } else {
        navigate({ to: '/', replace: true })
        return
      }

      navigate({ to: '/' })
    } catch (error) {
      console.error('Error saving user info:', error)
      toast.error('Something went wrong while saving user info.', {
        id: toastId,
      })
    }
  }

  const steps: Record<number, { title: string; description: string }> = {
    1: {
      title: 'Verify Email',
      description: 'Verification code sent! Please check your email.',
    },

    2: {
      title: 'Shop Details',
      description: 'Tell us about your shop',
    },
    3: {
      title: 'Settings (TODO SKIP)',
      description: 'Configure your preferences, #TODO SKIP FOR NOW',
    },
  }

  const progressPercentage = (currentStep / 3) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AuthFormStep
            isOtp={true}
            formData={formData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setFormData={setFormData}
            errors={parseErrors(errors)}
            backButton={false}
            onSubmit={handleNext}
            isLoading={isLoading}
            fields={[
              {
                fieldName: 'verificationCode',
                label: 'Enter Verification Code',
              },
            ]}
          />
        )

      case 2:
        return (
          <ShopDetailsForm
            onSubmit={handleShopDetailFormSubmit}
            setCurrentStep={setCurrentStep}
            collectedStoreData={collectedStoreData}
            setCollectedStoreData={setCollectedStoreData}
          />
        )
      case 3:
        return (
          <AuthFormStep
            register={register}
            errors={parseErrors(errors)}
            onSubmit={handleNext}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            isOtp={false}
            setValue={setValue}
            formData={formData}
            setFormData={setFormData}
            isLoading={isLoading}
            fields={[{ fieldName: 'storename', label: 'Shop Name' }]}
          />
        )
      default:
        return null
    }
  }

  return (
    <AuthLayout>
      <Card className='w-[28rem]'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-center text-2xl font-semibold tracking-tight'>
            {steps[currentStep]?.title}
          </CardTitle>
          {currentStep >= 1 && (
            <div className='relative h-1 rounded-lg bg-gray-300'>
              <div
                className='absolute h-full rounded-lg bg-black'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
          <CardDescription>{steps[currentStep]?.description}</CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
        <CardFooter className='flex items-center justify-center'>
          {currentStep === 1 && (
            <Button
              size='sm'
              variant='link'
              className='text-xs text-muted-foreground'
              onClick={async (e) => {
                e.preventDefault()
                setCountDown(20)
                try {
                  await resendCode()
                } catch (err) {
                  console.error('Failed to resend code', err)
                }
              }}
              disabled={countDown > 0}
            >
              {' '}
              {countDown > 0 ? `Resend Code (${countDown}s)` : 'Resend Code'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}

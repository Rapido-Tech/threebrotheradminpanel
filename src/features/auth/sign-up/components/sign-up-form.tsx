import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { useShopStore } from '@/stores/shopStore'
import StepOne from './stepOne'
import StepThree from './stepThree'
import StepTwo from './stepTwo'

export type SignUpData = {
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  firstname: string
  lastname: string
}

export default function SignUpForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL

  const handleNext = async (newData: Partial<SignUpData>) => {
    const updated = { ...formData, ...newData }
    setFormData(updated)

    if (step === 2) {
      // Send data to register user and trigger email
      const toastId = toast.loading('Sending verification email...')
      try {
        await axios.post(
          `${API_URL}/register`,
          {
            email: updated.email,
            password: updated.password,
            firstname: updated.firstname,
            lastname: updated.lastname,
            phoneNumber: updated.phoneNumber,
          },
          { withCredentials: true }
        )

        toast.success('Verification email sent!', { id: toastId })
        setStep(3)
      } catch (err) {
        const msg =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : 'Failed to register or send verification email'
        toast.error(msg, { id: toastId })
      }
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleVerificationSubmit = async () => {
    setIsVerifying(true)
    const toastId = toast.loading('Verifying code...')
    try {
      const res = await axios.post(
        `${API_URL}/verify-email`,
        {
          email: formData.email,
          code: verificationCode,
        },
        { withCredentials: true }
      )

      const { user } = res.data
      useAuthStore.getState().setUser(user)

      if (Array.isArray(user.storeIds)) {
        useShopStore.getState().setActiveShopId(user.storeIds[0])
      }

      toast.success('Account verified!', { id: toastId })
      navigate({ to: '/', replace: true })
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Invalid verification code'
      toast.error(msg, { id: toastId })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <>
      {step === 1 && <StepOne data={formData} onNext={handleNext} />}
      {step === 2 && (
        <StepTwo data={formData} onNext={handleNext} onBack={handleBack} />
      )}
      {step === 3 && (
        <StepThree
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          onSubmit={handleVerificationSubmit}
          isLoading={isVerifying}
          onBack={handleBack}
        />
      )}
    </>
  )
}

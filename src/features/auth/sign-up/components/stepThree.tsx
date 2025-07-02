import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'

interface StepThreeProps {
  verificationCode: string
  setVerificationCode: (code: string) => void
  onSubmit: () => void | Promise<void>
  isLoading: boolean
  onBack: () => void
}

export default function StepThree({
  verificationCode,
  setVerificationCode,
  onSubmit,
  isLoading,
}: StepThreeProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className='space-y-4'
    >
      <div className='flex w-full flex-col items-center gap-4'>
        <Label className='w-full text-center' htmlFor='verificationCode'>
          Enter Verification Code
        </Label>
        <div className='w-full text-center'>
          <div className='flex flex-col items-center justify-center gap-2 py-2'>
            <InputOTP
              value={verificationCode}
              onChange={setVerificationCode}
              maxLength={6}
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
        </div>
      </div>

      <div className='flex justify-between'>
        <Button
          type='submit'
          className='w-full'
          disabled={isLoading || verificationCode.length !== 6}
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </div>
    </form>
  )
}

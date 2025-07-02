import { z } from 'zod'

// export const onboardingSchema = z.object({
//   verificationCode: z.string(),
//   firstName: z.string(),
//   secondName: z.string(),
//   userName: z.string(),
//   phoneNumber: z.string(),
//   email: z.string(),
//   shopName: z.string(),
//   shopPhoneNumber: z.string(),
//   address: z.string(),
//   country: z.string(),
// })

// export type OnBoardingFormData = z.infer<typeof onboardingSchema>

export const onboardingSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email().optional(),
    storename: z.string().min(2),
    phone: z.string().optional(),
    address: z.string().min(2).optional(),
    storephoneNo: z.string().min(1, 'Shop phone number is required'),
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    country: z.string().min(2).optional(),
    verificationCode: z.string().min(1, 'Please enter your verification code'),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone number must be provided',
    path: ['email', 'phoneNumber'],
  })

export const CreateNewShopSchema = z.object({
  storename: z.string().min(2),
  address: z.string().min(2).optional(),
  storephoneNo: z.string().min(1, 'Shop phone number is required'),
  country: z.string().min(2).optional(),
  isWarehouse: z.boolean().default(false),
})

export type OnBoardingFormData = z.infer<typeof onboardingSchema>

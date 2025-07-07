import { z } from 'zod'
import { isPhoneValid } from '@/utils/helper-functions'

export const shopSchema = z.object({
  _id: z.string(),
  storename: z.string(),
  storephoneNo: z.string(),
  productIds: z.array(z.string()),
  transactionIds: z.array(z.string()),
  historyIds: z.array(z.string()),
  unitsIds: z.array(z.string()),
  categoriesIds: z.array(z.string()),
  userPermissions: z.array(
    z.object({
      userId: z.string(),
      role: z.string(),
      permissions: z.array(z.string()),
    })
  ),
  address: z.string().optional(),
  country: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Zod schema validation with custom phone validation
export const userSchema = z.object({
  firstname: z.string().min(3, 'First name must be at least 3 characters'),
  email: z.string().email().optional(),
  lastname: z.string().min(3, 'Second name must be at least 3 characters'),
  username: z.string().min(3, 'User name must be at least 3 characters'),
  phone: z
    .string()
    .refine((value) => isPhoneValid(value), {
      message: 'Phone number is invalid',
    })
    .optional(),
})

// Zod schema validation
export const storeSchema = z.object({
  storename: z.string().min(1, 'Enter your shop name'),
  address: z.string().min(1, 'Enter your shop address'),
  country: z.string().min(1, 'Enter your shop country'),
  email: z.string().email().optional(),
  storephoneNo: z
    .string()
    .min(1, 'Phone number is required')
    .refine((value) => isPhoneValid(value), {
      message: 'Phone number is invalid',
    }),
})

export const OnBoardingFormSchema = z.object({
  verificationCode: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  storename: z.string(),
  username: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  storephoneNo: z.string(),
  address: z.string(),
  country: z.string(),
})

// Type inference for the Zod schema
export type StoreData = z.infer<typeof storeSchema>
export type ShopData = z.infer<typeof shopSchema>
export type UserData = z.infer<typeof userSchema>
export type OnBoardingFormData = z.infer<typeof OnBoardingFormSchema>

export interface ProductDataset {
  _id?: string
  name?: string
  symbol?: string
}

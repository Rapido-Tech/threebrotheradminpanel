import { z } from 'zod'

export const shopSchema = z.object({
  _id: z.string(),
  isWarehouse: z.boolean().default(false),
  shopName: z.string(),
  shopPhoneNumber: z.string(),
  productIds: z.array(z.string()),
  transactionIds: z.array(z.string()),
  historyIds: z.array(z.string()),
  unitsIds: z.array(z.string()),
  stakeholderIds: z.array(z.string()),
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

// Type inference for the Zod schema
export type ShopData = z.infer<typeof shopSchema>

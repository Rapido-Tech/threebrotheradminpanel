import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email().optional(),
  username: z.string(),
  password: z.string(),
  mongoDbUri: z.string().url(),
  name: z.object({
    firstname: z.string(),
    lastname: z.string(),
  }),
  address: z.object({
    city: z.string().optional(),
    street: z.string().optional(),
    number: z.number().optional(),
    zipcode: z.string().optional(),
    geolocation: z
      .object({
        lat: z.string().optional(),
        long: z.string().optional(),
      })
      .optional(),
  }),
  phone: z.string().optional(),
})

export type User = z.infer<typeof userSchema>

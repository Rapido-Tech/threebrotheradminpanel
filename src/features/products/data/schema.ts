import { z } from 'zod'
import { _ } from 'node_modules/@faker-js/faker/dist/airline-BUL6NtOJ'

const VariantSchema = z.object({
  id: z.string(),
  variantType: z.string(),
  subVariation: z.array(
    z.object({
      name: z.string(),
      quantity: z.coerce.number(),
      amount: z.coerce.number(),
    })
  ),
})

// Final product schema
export const ProductSchema = z
  .object({
    productName: z.string().min(1, 'Product Name is required'),
    description: z.string().min(1, 'Product description required'),
    sellingPrice: z.coerce.number().min(1, 'Product selling price is required'),
    buyingPrice: z.coerce.number().min(1, 'Product buying Price is required'),
    stock: z.coerce.number().min(0, 'Product stock is required'),
    category: z.object({
      _id: z.string().min(1, 'Category ID is required'),
      categoryName: z.string().min(1, 'Category name is required'),
    }),
    unit: z.object({
      _id: z.string(),
      unitName: z.string(),
      unitSymbol: z.string(),
    }),
    discount: z.coerce.number().optional(),
    sections: z
      .array(z.object({ _id: z.string(), sectionName: z.string() }))
      .optional(),
    visible: z.boolean().default(true),
    variations: z.array(VariantSchema).optional(),
    productImages: z.array(
      z.object({
        id: z.string(),
        file: z.instanceof(File),
        preview: z.string(),
        isMain: z.boolean().optional(),
      })
    ),
    isPublished: z.boolean().default(true).optional(),
  })
  .refine((data) => data.sellingPrice > data.buyingPrice, {
    path: ['sellingPrice'],
    message: 'Selling Price must be greater than Purchase Price',
  })

export const ProductsFormSchema = z.object({
  products: z.array(ProductSchema),
})

export const FetchedProductSchema = z.object({
  _id: z.string(),
  productName: z.string(),
  brand: z.string(),
  stock: z.number(),
  sellingPrice: z.number(),
  buyingPrice: z.number(),
  discount: z.number(),
  unit: z.object({
    _id: z.string(),
    unitName: z.string(),
    unitSymbol: z.string(),
  }),
  description: z.string(),
  isPublished: z.boolean(),
  category: z.object({
    _id: z.string(),
    categoryName: z.string(),
  }),
  variations: z.array(VariantSchema).optional(),

  createdAt: z.coerce.date(),
  productImages: z.array(
    z.object({
      publicId: z.string(),
      url: z.string(),
      isMain: z.boolean(),
    })
  ),
})

export type ProductsFormData = z.infer<typeof ProductsFormSchema>
export type Product = z.infer<typeof ProductSchema>
export type Variation = z.infer<typeof VariantSchema>
export type SavedProduct = z.infer<typeof FetchedProductSchema>

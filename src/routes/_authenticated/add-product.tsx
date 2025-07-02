import { createFileRoute } from '@tanstack/react-router'
import AddNewProduct from '@/features/products/add-product'

export const Route = createFileRoute('/_authenticated/add-product')({
  component: AddNewProduct,
})

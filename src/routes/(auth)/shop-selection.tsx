import { createFileRoute } from '@tanstack/react-router'
import ShopSelector from '@/features/auth/shop-selection'

export const Route = createFileRoute('/(auth)/shop-selection')({
  component: ShopSelector,
})

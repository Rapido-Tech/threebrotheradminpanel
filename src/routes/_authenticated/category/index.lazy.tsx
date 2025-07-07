import { createLazyFileRoute } from '@tanstack/react-router'
import Category from '@/features/category'

export const Route = createLazyFileRoute('/_authenticated/category/')({
  component: Category,
})

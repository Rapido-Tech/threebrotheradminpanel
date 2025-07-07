import { createLazyFileRoute } from '@tanstack/react-router'
import Unit from '@/features/units'

export const Route = createLazyFileRoute('/_authenticated/unit/')({
  component: Unit,
})

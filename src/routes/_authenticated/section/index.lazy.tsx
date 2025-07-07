import { createLazyFileRoute } from '@tanstack/react-router'
import Section from '@/features/sections'

export const Route = createLazyFileRoute('/_authenticated/section/')({
  component: Section,
})

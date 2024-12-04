import { createFileRoute } from '@tanstack/react-router'
import { Help } from '../../pages/register/Help'

export const Route = createFileRoute('/help/$help')({
  component: Help
})
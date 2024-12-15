import { createFileRoute } from '@tanstack/react-router'
import { SendResetCode } from '../../pages/auth/SendResetCode'

export const Route = createFileRoute('/auth/reset-password')({
  component: SendResetCode 
})

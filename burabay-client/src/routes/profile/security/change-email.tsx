import { createFileRoute } from '@tanstack/react-router'
import { ChangeEmail } from '../../../pages/security-settings/ChangeEmail'

export const Route = createFileRoute('/profile/security/change-email')({
  component: ChangeEmail,
})
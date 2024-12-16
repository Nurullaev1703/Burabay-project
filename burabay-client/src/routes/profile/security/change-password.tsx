import { createFileRoute } from '@tanstack/react-router'
import { ChangePasswordPage } from '../../../pages/security-settings/ChangePassword'

export const Route = createFileRoute('/profile/security/change-password')({
  component: ChangePasswordPage
})

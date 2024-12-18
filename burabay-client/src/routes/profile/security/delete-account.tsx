import { createFileRoute } from '@tanstack/react-router'
import { DeleteProfile } from '../../../pages/profile/delete/DeleteProfile'

export const Route = createFileRoute('/profile/security/delete-account')({
  component: DeleteProfile
})

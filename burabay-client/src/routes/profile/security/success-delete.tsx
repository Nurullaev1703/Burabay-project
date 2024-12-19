import { createFileRoute } from '@tanstack/react-router'
import { SuccessDelete } from '../../../pages/profile/delete/SuccessDelete'

export const Route = createFileRoute('/profile/security/success-delete')({
  component: SuccessDelete
})

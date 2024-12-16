import { createFileRoute } from '@tanstack/react-router'
import { AcceptNewEmail } from '../../../pages/security-settings/AcceptNewEmail'

export const Route = createFileRoute('/profile/security/accept-email/$email')({
  component: RouteComponent,
})

function RouteComponent() {
  const { email } = Route.useParams()

  return <AcceptNewEmail email={email} />
}

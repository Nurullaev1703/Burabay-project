import { createFileRoute } from '@tanstack/react-router'
import { AcceptEmail } from '../../pages/auth/AcceptEmail';

export const Route = createFileRoute('/auth/accept/$email')({
  component: AcceptPhoneRoute,
})

function AcceptPhoneRoute() {
  const { email } = Route.useParams()

  return <AcceptEmail email={email} />;
}

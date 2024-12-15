import { createFileRoute } from '@tanstack/react-router'
import { RecoveryPasswordEmail } from '../../pages/auth/RecoveryPasswordEmail'

export const Route = createFileRoute('/auth/recovery/$email')({
  component: RecoveryEmail,
})

function RecoveryEmail() {
  const { email } = Route.useParams();
  return <RecoveryPasswordEmail email={email} />;
}

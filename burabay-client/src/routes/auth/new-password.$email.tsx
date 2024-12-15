import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordPage } from '../../pages/auth/ResetPasswordPage';

export const Route = createFileRoute('/auth/new-password/$email')({
  component: NewPasswordRoute,
})
function NewPasswordRoute() {
  const { email } = Route.useParams()
  return <ResetPasswordPage email={email} />;
}

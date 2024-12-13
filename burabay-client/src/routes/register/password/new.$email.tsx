import { createFileRoute } from '@tanstack/react-router'
import { NewPasswordPage } from '../../../pages/register/NewPasswordPage'

export const Route = createFileRoute('/register/password/new/$email')({
  component: NewPasswordPageRoute,
})

function NewPasswordPageRoute() {
  const { email } = Route.useParams()

  return <NewPasswordPage email={email} />
}

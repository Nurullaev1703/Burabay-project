import { createFileRoute } from '@tanstack/react-router'
import { IEForm } from '../../../pages/profile/confirm/IEForm'

export const Route = createFileRoute('/profile/confirm/ie')({
  component: RouteComponent,
})

function RouteComponent() {
  return <IEForm />
}

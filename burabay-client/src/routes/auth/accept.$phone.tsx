import { createFileRoute } from '@tanstack/react-router'
import { AcceptPhone } from '../../pages/auth/AcceptPhone'

export const Route = createFileRoute('/auth/accept/$phone')({
  component: AcceptPhoneRoute
})

function AcceptPhoneRoute(){
  const { phone } = Route.useParams()

  return <AcceptPhone phoneNumber={phone} />
}
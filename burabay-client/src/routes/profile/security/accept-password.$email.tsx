import { createFileRoute } from '@tanstack/react-router'
import { AcceptPassword } from '../../../pages/security-settings/AcceptPassword'
import { useAuth } from '../../../features/auth'
import { Login } from '../../../pages/auth/Login'

export const Route = createFileRoute(
  '/profile/security/accept-password/$email',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { email } = Route.useParams()
  const {user} = useAuth()
  if(user){
    return <AcceptPassword email={email} currentEmail={user?.email}/>
  }

  else{
    return <Login />
  }
}

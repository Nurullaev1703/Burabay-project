import { createFileRoute } from '@tanstack/react-router'
import AuthPage from '../../../pages/admin/auth-admin/AuthPage'

export const Route = createFileRoute('/admin/auth/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><AuthPage /></div>
}

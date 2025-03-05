import { createFileRoute } from '@tanstack/react-router'
import UsersPage from '../../../../pages/admin/dashboard/UsersPage'

export const Route = createFileRoute('/admin/dashboard/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div> <UsersPage /> </div>
}
import { createFileRoute } from '@tanstack/react-router'
import MessagesPage from '../../../../pages/admin/dashboard/MessagesPage'

export const Route = createFileRoute('/admin/dashboard/messages/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div> <MessagesPage/> </div>
}

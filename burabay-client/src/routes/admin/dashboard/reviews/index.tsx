import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/dashboard/reviews/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/dashboard/reviews/"!</div>
}

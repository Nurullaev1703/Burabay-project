import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/banner/$bannerId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/banner/$bannerId"!</div>
}

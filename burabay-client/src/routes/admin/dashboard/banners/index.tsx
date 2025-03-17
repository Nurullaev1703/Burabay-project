import { createFileRoute } from '@tanstack/react-router'
import BannersPage from '../../../../pages/admin/dashboard/BannersPage'

export const Route = createFileRoute('/admin/dashboard/banners/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><BannersPage /></div>
}

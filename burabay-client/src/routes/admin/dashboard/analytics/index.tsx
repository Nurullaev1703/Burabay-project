import { createFileRoute } from '@tanstack/react-router'
import AnalyticsPage from '../../../../pages/admin/dashboard/AnalyticsPage'

export const Route = createFileRoute('/admin/dashboard/analytics/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><AnalyticsPage /></div>
}

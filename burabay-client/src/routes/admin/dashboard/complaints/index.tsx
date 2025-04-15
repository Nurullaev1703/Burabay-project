import { createFileRoute } from '@tanstack/react-router'
import ComplaintsPage from '../../../../pages/admin/dashboard/ComplaintsPage'

export const Route = createFileRoute('/admin/dashboard/complaints/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    {/* @ts-ignore */}
      <ComplaintsPage />
    </>
  )
}

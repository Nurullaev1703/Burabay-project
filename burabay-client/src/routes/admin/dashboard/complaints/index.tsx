import { createFileRoute } from '@tanstack/react-router'
import ComplaintsPage from '../../../../pages/admin/dashboard/ComplaintsPage'
import { useGetProfile } from '../../../../pages/profile/profile-util'
import { Loader } from '../../../../components/Loader'

export const Route = createFileRoute('/admin/dashboard/complaints/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <ComplaintsPage />
    </>
  )
}

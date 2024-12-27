import { createFileRoute } from '@tanstack/react-router'
import { UseGetServiceSchedule } from '../../../pages/announcements/announcement/serviceSchedule/serviceSchedule-util'
import { Loader } from '../../../components/Loader'
import { ServiceSchedule } from '../../../pages/announcements/announcement/serviceSchedule/ServiceSchedule'

export const Route = createFileRoute(
  '/announcements/service-schedule/$announcementId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { announcementId } = Route.useParams()
  const { data, isLoading } = UseGetServiceSchedule(announcementId)
  if (isLoading) {
    return <Loader />
  }
  if (data) {
    return <ServiceSchedule serviceSchedule={data} />
  }
}

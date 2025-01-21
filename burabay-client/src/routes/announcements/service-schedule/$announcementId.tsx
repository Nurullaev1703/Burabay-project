import { createFileRoute } from '@tanstack/react-router'
import { UseGetServiceSchedule } from '../../../pages/announcements/announcement/serviceSchedule/serviceSchedule-util'
import { Loader } from '../../../components/Loader'
import { ServiceSchedule } from '../../../pages/announcements/announcement/serviceSchedule/ServiceSchedule'
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util'

export const Route = createFileRoute(
  '/announcements/service-schedule/$announcementId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { announcementId } = Route.useParams()
  const {data: announcementData, isLoading: announcementIsLoading} = UseGetAnnouncement(announcementId);
  const { data, isLoading } = UseGetServiceSchedule(announcementId)
  if (isLoading && announcementIsLoading) {
    return <Loader />
  }
  if (data && announcementData) {
    return <ServiceSchedule serviceSchedule={data} announcement={announcementData} />
  }
}

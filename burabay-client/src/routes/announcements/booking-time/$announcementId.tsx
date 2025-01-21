import { createFileRoute } from '@tanstack/react-router'
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util'
import { UseGetServiceSchedule } from '../../../pages/announcements/announcement/serviceSchedule/serviceSchedule-util'
import { Loader } from '../../../components/Loader'
import { BookingTime } from '../../../pages/announcements/booking-time/BookingTime'

export const Route = createFileRoute(
  '/announcements/booking-time/$announcementId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { announcementId } = Route.useParams()
  const { data: announcementData, isLoading: announcementIsLoading } =
    UseGetAnnouncement(announcementId)
  const { data, isLoading } = UseGetServiceSchedule(announcementId)
  if (isLoading && announcementIsLoading) {
    return <Loader />
  }
  if (data && announcementData) {
    return (
      <BookingTime serviceSchedule={data} announcement={announcementData} />
    )
  }
}

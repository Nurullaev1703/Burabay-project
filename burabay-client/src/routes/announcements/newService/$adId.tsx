import { createFileRoute } from '@tanstack/react-router'
import { NewService } from '../../../pages/announcements/NewService'
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util'
import { Loader } from '../../../components/Loader'

export const Route = createFileRoute('/announcements/newService/$adId')({
  component: NewServiceRoute,
})
function NewServiceRoute() {
  const { adId } = Route.useParams()
  const { data, isLoading } = UseGetAnnouncement(adId)

  if (isLoading) {
    return <Loader />
  }
  if (data) {
    return <NewService adId={adId} announcement={data}/>;
  }
}
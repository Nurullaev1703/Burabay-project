import { createFileRoute } from '@tanstack/react-router'
import { ChoiseDetails } from '../../../pages/announcements/ChoiseDetails'
import { Loader } from '../../../components/Loader'
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util'

export const Route = createFileRoute('/announcements/edit/choiseDetails/$adId')(
  {
    component: ChoiseDetailsRoute,
  },
)

function ChoiseDetailsRoute() {
  const { adId } = Route.useParams()
  const { data, isLoading } = UseGetAnnouncement(adId)
  if (isLoading) return <Loader />
  if (data) {
    return (
      <ChoiseDetails category={data.subcategory.category} subcategory={data.subcategory} announcement={data} />
    )
  }
}

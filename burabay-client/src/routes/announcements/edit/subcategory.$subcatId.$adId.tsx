import { createFileRoute } from '@tanstack/react-router'
import { Loader } from '../../../components/Loader'
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util'
import { useGetCategoryId } from '../../../pages/announcements/announcements-utils'
import { AddAnnouncementsStepTwo } from '../../../pages/announcements/AddAnnouncementsStepTwo'

export const Route = createFileRoute(
  "/announcements/edit/subcategory/$subcatId/$adId"
)({
  component: PlacingSubcategory,
});

function PlacingSubcategory() {
  const { adId, subcatId } = Route.useParams()
  const { data, isLoading } = useGetCategoryId(subcatId);
  const adInfo = UseGetAnnouncement(adId)
  if (isLoading || adInfo.isLoading) return <Loader />
  if (data && adInfo.data) {
    return <AddAnnouncementsStepTwo category={data} ad={ adInfo.data } />
  }
}

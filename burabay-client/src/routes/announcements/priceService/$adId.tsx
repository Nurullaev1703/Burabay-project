import { createFileRoute } from '@tanstack/react-router'
import { PriceService } from '../../../pages/announcements/PriceService'
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util'
import { Loader } from '../../../components/Loader'

export const Route = createFileRoute("/announcements/priceService/$adId")({
  component: PriceServiceRoute,
});

function PriceServiceRoute() {
  const { adId } = Route.useParams()
  const { data, isLoading } = UseGetAnnouncement(adId)
  if (isLoading) {
    return <Loader />
  }
  if (data) {
    return <PriceService adId={adId} announcement={data}/>
  }
  
}
import { createFileRoute } from '@tanstack/react-router'
import { MapComponent } from '../../pages/map/MapComponent'
import { UseGetAnnouncement } from '../../pages/announcements/announcement/announcement-util'
import { Loader } from '../../components/Loader'

export const Route = createFileRoute('/map/$adId')({
  component: MapRoute,
})

function MapRoute() {
  const { adId } = Route.useParams()
  const { data, isLoading } = UseGetAnnouncement(adId)
  if (isLoading) {
    return <Loader />
  }
  if (data) {
    return <MapComponent adId={adId} announcement={ data } />;
  }
}
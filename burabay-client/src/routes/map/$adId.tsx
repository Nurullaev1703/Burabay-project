import { createFileRoute } from '@tanstack/react-router'
import { MapComponent } from '../../pages/map/MapComponent'

export const Route = createFileRoute('/map/$adId')({
  component: () => <MapComponent adId={Route.useParams().adId}/>,
})

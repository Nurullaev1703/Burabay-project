import { createFileRoute } from '@tanstack/react-router'
import { PriceService } from '../../../pages/announcements/PriceService'

export const Route = createFileRoute('/announcements/priceService/$adId')({
  component: () => <PriceService adId={Route.useParams().adId}/>,
})

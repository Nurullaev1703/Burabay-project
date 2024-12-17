import { createFileRoute } from '@tanstack/react-router'
import { PriceService } from '../../../pages/announcements/PriceService'

export const Route = createFileRoute('/announcements/priceService/')({
  component: PriceService,
})


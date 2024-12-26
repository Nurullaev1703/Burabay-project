import { createFileRoute } from '@tanstack/react-router'
import { Reviews } from '../../../pages/reviews/reviewsOrg/Reviews'

export const Route = createFileRoute('/reviews/reviewsOrg/')({
  component: Reviews,
})


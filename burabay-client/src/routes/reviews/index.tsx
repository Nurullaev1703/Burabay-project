import { createFileRoute } from '@tanstack/react-router'
import { Reviews } from '../../pages/reviews/Reviews'

export const Route = createFileRoute('/reviews/')({
  component: Reviews,
})


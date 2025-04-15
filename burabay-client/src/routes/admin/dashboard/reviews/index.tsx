import { createFileRoute } from '@tanstack/react-router'
import ReviewsPage from '../../../../pages/admin/dashboard/ReviewsPage'

export const Route = createFileRoute('/admin/dashboard/reviews/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div> <ReviewsPage /> </div>
}

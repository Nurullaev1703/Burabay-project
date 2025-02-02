import { createFileRoute } from '@tanstack/react-router'
import { FilterPage } from '../../pages/booking/booking-page/FilterPage'

export const Route = createFileRoute('/booking/filter')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FilterPage />;
}

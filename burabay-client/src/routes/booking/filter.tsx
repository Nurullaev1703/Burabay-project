import { createFileRoute } from '@tanstack/react-router'
import { FilterPage } from '../../pages/booking/booking-page/FilterPage'

interface BookingFilter{
  onlinePayment?: boolean;
  onSidePayment?: boolean
  canceled?: boolean
}

export const Route = createFileRoute('/booking/filter')({
  component: RouteComponent,
  validateSearch: () => ({}) as BookingFilter
})

function RouteComponent() {
  return <FilterPage />;
}

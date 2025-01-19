import { createFileRoute } from '@tanstack/react-router'
import { Booking } from '../../../pages/announcements/booking/Booking'

export const Route = createFileRoute('/announcements/booking/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Booking/>
}
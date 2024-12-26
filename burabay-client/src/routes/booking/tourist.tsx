import { createFileRoute } from '@tanstack/react-router'
import { BookingTourist } from '../../pages/booking/BookingTourist'

export const Route = createFileRoute('/booking/tourist')({
  component: BookingTourist,
})

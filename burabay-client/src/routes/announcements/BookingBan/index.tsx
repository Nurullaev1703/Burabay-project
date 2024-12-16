import { createFileRoute } from '@tanstack/react-router'
import { BookingBan } from '../../../pages/announcements/BookingBan'

export const Route = createFileRoute('/announcements/BookingBan/')({
  component: BookingBan,
})


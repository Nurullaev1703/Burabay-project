import { createFileRoute } from '@tanstack/react-router'
import { AddAnnouncements } from '../../../pages/announcements/AddAnnouncements'

export const Route = createFileRoute('/announcements/addAnnouncements/')({
  component: AddAnnouncements,
})



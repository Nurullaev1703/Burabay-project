import { createFileRoute } from '@tanstack/react-router'
import { Announcements } from '../../pages/announcements/Announcements'

export const Route = createFileRoute('/announcements/')({
  component: Announcements,
})


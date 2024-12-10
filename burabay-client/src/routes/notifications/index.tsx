import { createFileRoute } from '@tanstack/react-router'
import { Notifications } from '../../pages/notifications/Notifications'

export const Route = createFileRoute('/notifications/')({
  component: Notifications,
})

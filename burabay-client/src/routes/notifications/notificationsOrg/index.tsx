import { createFileRoute } from '@tanstack/react-router'
import { Notifications } from '../../../pages/notifications/notificationOrg.tsx/Notifications'

export const Route = createFileRoute('/notifications/notificationsOrg/')({
  component: Notifications,
})


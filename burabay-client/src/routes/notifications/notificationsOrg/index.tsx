import { createFileRoute } from '@tanstack/react-router'
import { Loader } from '../../../components/Loader'
import { useGetNotification } from '../../../pages/notifications/notificationOrg/notificaions-utils'
import { Notifications } from '../../../pages/notifications/notificationOrg/Notifications'

export const Route = createFileRoute('/notifications/notificationsOrg/')({
  component: GetNotification,
})

function GetNotification() {
  const { data, isLoading } = useGetNotification()
  if (isLoading) {
    return <Loader />
  }
  if (data) {
    return (
      <>
        <Notifications user={data.profile} notifications={data.notification} />
      </>
    )
  }
}

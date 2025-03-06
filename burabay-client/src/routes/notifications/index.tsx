import { createFileRoute } from '@tanstack/react-router'
import { NotificationsClient } from '../../pages/notifications/NotificationsClient'
import { Loader } from '../../components/Loader'
import { useGetNotification } from '../../pages/notifications/notificationOrg/notificaions-utils'

export const Route = createFileRoute('/notifications/')({
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
        <NotificationsClient user={data.profile} notifications={data.notification} />
      </>
    )
  }
}
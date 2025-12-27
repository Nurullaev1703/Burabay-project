import { createFileRoute } from '@tanstack/react-router'
import MessagesPage from '../../../../pages/admin/dashboard/MessagesPage'
import { useGetCategory } from '../../../../pages/announcements/announcements-utils'
import { Loader } from '../../../../components/Loader'

export const Route = createFileRoute('/admin/dashboard/messages/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useGetCategory()
  if (isLoading) {
    return <Loader />
  }
  if (data) {
    
    return <MessagesPage categories={data}/>
  }
}

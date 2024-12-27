import { createFileRoute } from '@tanstack/react-router'
import { Announcements } from '../../pages/announcements/Announcements'
import { useAuth } from '../../features/auth'
import { UseGetOrganizationAnnouncements } from '../../pages/announcements/announcements-utils'
import { Loader } from '../../components/Loader'

export const Route = createFileRoute("/announcements/")({
  component: AdRoute,
});

function AdRoute(){
  const {user} = useAuth()
  if(user?.organization?.id){
    const {data, isLoading} = UseGetOrganizationAnnouncements(user?.organization?.id)
    if(data){
      return <Announcements announcements={data}/>
    }
    if(isLoading){
      return <Loader />
    }
  }
}
import { createFileRoute } from '@tanstack/react-router'
import { Loader } from '../../../components/Loader'
import {UseGetOrganizationAnnouncementsTwo } from '../../../pages/announcements/announcements-utils'
import { MapAnnoun } from '../../../pages/announcements/mapForAnnoun/MapAnnoun'
import { useAuth } from '../../../features/auth'

export const Route = createFileRoute('/announcements/mapForAnnoun/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  if(user?.organization?.id){
    const {data, isLoading} = UseGetOrganizationAnnouncementsTwo(user?.organization?.id)
    if(data){
      return <MapAnnoun announcements={data}/>
    }
    if(isLoading){
      return <Loader />
    }
  }
}

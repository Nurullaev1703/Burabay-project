import { createFileRoute } from '@tanstack/react-router'
import { Announcements } from '../../pages/announcements/Announcements'
import { useAuth } from '../../features/auth'
import { MapFilter, UseGetOrganizationAnnouncements } from '../../pages/announcements/announcements-utils'
import { Loader } from '../../components/Loader'

export const Route = createFileRoute("/announcements/")({
  component: AdRoute,
  validateSearch: () => ({}) as MapFilter
});

function AdRoute(){
  const { user } = useAuth()
  const filters = Route.useSearch()
  if(user?.organization?.id){
    const {data, isLoading} = UseGetOrganizationAnnouncements(user?.organization?.id, filters)
    if(data){
      return <Announcements announcements={data} filters={filters}/>
    }
    if(isLoading){
      return <Loader />
    }
  }
}
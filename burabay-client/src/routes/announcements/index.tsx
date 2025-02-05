import { createFileRoute } from '@tanstack/react-router'
import { Announcements } from '../../pages/announcements/Announcements'
import { useAuth } from '../../features/auth'
import { MapFilter } from '../../pages/announcements/announcements-utils'


export const Route = createFileRoute("/announcements/")({
  component: AdRoute,
  validateSearch: () => ({}) as MapFilter
});

function AdRoute(){
  const { user } = useAuth()
  const filters = Route.useSearch()
  if(user?.organization?.id){
      return <Announcements orgId={user?.organization?.id} filters={filters} />;
  }
}
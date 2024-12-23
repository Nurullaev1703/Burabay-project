import { createFileRoute } from '@tanstack/react-router'
import { SearchAd } from '../../pages/mapNav/ui/SearchAd'
import { UseGetAnnouncements } from '../../pages/announcements/announcements-utils'
import { Loader } from '../../components/Loader'

export const Route = createFileRoute('/mapNav/search/$value')({
  component: RouteComponent,
})

function RouteComponent() {
  const {value} = Route.useParams()
  const { data, isLoading } = UseGetAnnouncements()
  if (isLoading) {
    return <Loader />
  }
  if (data) {
    return <SearchAd announcements={data.announcement} currentValue={value} />
  }
}

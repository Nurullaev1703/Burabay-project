import { createFileRoute } from '@tanstack/react-router'
import { AddAnnouncements } from '../../../pages/announcements/AddAnnouncements'
import { useGetCategory } from '../../../pages/announcements/announcements-utils'
import { Loader } from '../../../components/Loader'

export const Route = createFileRoute('/announcements/addAnnouncements/')({
  component: PlacingCategory,
})

function PlacingCategory() {
  const {data , isLoading} = useGetCategory()
  if(isLoading) return <Loader/>
  if(data){
    return <AddAnnouncements category={data}/>
  }
}


import { createFileRoute } from '@tanstack/react-router'
import { AddAnnouncementsStepTwo } from '../../../pages/announcements/AddAnnouncementsStepTwo'
import { useGetCategoryId } from '../../../pages/announcements/announcements-utils'
import { Loader } from '../../../components/Loader'

export const Route = createFileRoute(
  '/announcements/addAnnouncementsStepTwo/$categoryId',
)({
  component: PlacingCategory,
})

function PlacingCategory() {
  const { categoryId } = Route.useParams()
  const { data, isLoading } = useGetCategoryId(categoryId)
  if (isLoading) return <Loader />
  if (data) {
    return <AddAnnouncementsStepTwo category={data} />
  }
}

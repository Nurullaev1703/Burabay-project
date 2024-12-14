import { createFileRoute } from '@tanstack/react-router'
import { ChoiseDetails } from '../../../pages/announcements/ChoiseDetails'
import { useGetCategorySubcategoryId } from '../../../pages/announcements/announcements-utils'
import { Loader } from '../../../components/Loader'

export const Route = createFileRoute(
  '/announcements/choiseDetails/$categoryId/$subcategoryId',
)({
  component: ChoiseDetailsRoute,
})

function ChoiseDetailsRoute() {
    const { categoryId , subcategoryId } = Route.useParams()
    const { data, isLoading } = useGetCategorySubcategoryId(categoryId , subcategoryId)
    if (isLoading) return <Loader />
    if (data) {
      return <ChoiseDetails category={data} subcategory={data} />
    }
  }

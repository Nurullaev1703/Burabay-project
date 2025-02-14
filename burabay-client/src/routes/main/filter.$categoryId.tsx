import { createFileRoute } from '@tanstack/react-router'
import { MainPageFilter } from '../../pages/main/model/mainpage-types'
import { MainFilter } from '../../pages/main/MainFilter'
import { useGetMainPageCategory } from '../../pages/main/main-utils'
import { Loader } from '../../components/Loader'

export const Route = createFileRoute('/main/filter/$categoryId')({
  component: () => <MainFilterRoute />,
  validateSearch: () => ({}) as MainPageFilter,
})

function MainFilterRoute() {
  const filters = Route.useSearch()
  const {categoryId} = Route.useParams()
  const { data, isLoading } = useGetMainPageCategory(categoryId)
  if (data) {
    return <MainFilter category={data} filters={filters} />
  }
  if (isLoading) {
    return <Loader />
  }
}

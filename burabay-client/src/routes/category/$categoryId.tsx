import { createFileRoute } from '@tanstack/react-router'
import { MainPageFilter } from '../../pages/main/model/mainpage-types'
import { CategoryPage } from '../../pages/main/CategoryPage'
import { useGetMainPageCategory } from '../../pages/main/main-utils'
import { Loader } from '../../components/Loader'

export const Route = createFileRoute('/category/$categoryId')({ 
  component: () => <CategoryPageRoute />,
  validateSearch: () => ({}) as MainPageFilter,
})

function CategoryPageRoute() {
  const filters = Route.useSearch()
  const {categoryId} = Route.useParams()
  const { data, isLoading } = useGetMainPageCategory(categoryId)
  
  if (data) {
    return <CategoryPage category={data} filters={filters} />
  }
  
  if (isLoading) {
    return <Loader />
  }
}

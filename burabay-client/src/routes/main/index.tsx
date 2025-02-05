import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../pages/main/Main'
import { Loader } from '../../components/Loader';
import { MapFilter } from '../../pages/announcements/announcements-utils';
import { useGetMainPageCategories } from '../../pages/main/main-utils';

export const Route = createFileRoute("/main/")({
  component: MainRoute,
  validateSearch: () => ({}) as MapFilter
});


function MainRoute(){
  const filters = Route.useSearch()
  const { data, isLoading } = useGetMainPageCategories();
  if(data){
    return <Main categories={data} filters={filters}/>
  }
  if(isLoading){
    return <Loader />
  }
}
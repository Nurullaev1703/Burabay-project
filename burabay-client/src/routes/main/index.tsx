import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../pages/main/Main'
import { useGetMainPage } from '../../pages/main/main-utils'
import { Loader } from '../../components/Loader';
import { MapFilter } from '../../pages/announcements/announcements-utils';

export const Route = createFileRoute("/main/")({
  component: MainRoute,
  validateSearch: () => ({}) as MapFilter
});


function MainRoute(){
  const filters = Route.useSearch()
  const { data, isLoading } = useGetMainPage(filters);
  if(data){
    return <Main announcements={data.ads} categories={data.categories} filters={filters}/>
  }
  if(isLoading){
    return <Loader />
  }
}
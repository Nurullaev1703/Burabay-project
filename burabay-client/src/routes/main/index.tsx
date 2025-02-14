import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../pages/main/Main'
import { Loader } from '../../components/Loader';
import { useGetMainPageCategories } from '../../pages/main/main-utils';
import { MainPageFilter } from '../../pages/main/model/mainpage-types';

export const Route = createFileRoute("/main/")({
  component: MainRoute,
  validateSearch: () => ({}) as MainPageFilter
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
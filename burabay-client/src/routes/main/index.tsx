import { createFileRoute } from '@tanstack/react-router'
import { Main } from '../../pages/main/Main'
import { useGetMainPage } from '../../pages/main/main-utils'
import { Loader } from '../../components/Loader';

export const Route = createFileRoute("/main/")({
  component: MainRoute,
});


function MainRoute(){
  const {data, isLoading} = useGetMainPage()
  if(data){
    return <Main announcements={data.ads} categories={data.categories}/>
  }
  if(isLoading){
    return <Loader />
  }
}
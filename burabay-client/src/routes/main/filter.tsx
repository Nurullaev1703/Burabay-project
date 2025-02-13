import { createFileRoute } from '@tanstack/react-router'
import { MainPageFilter } from '../../pages/main/model/mainpage-types';
import { MainFilter } from '../../pages/main/MainFilter';

export const Route = createFileRoute("/main/filter")({
  component: () => <MainFilterRoute />,
  validateSearch: () => ({}) as MainPageFilter,
});


function MainFilterRoute(){
    const filters = Route.useSearch()
    return <MainFilter filters={filters}/>
}
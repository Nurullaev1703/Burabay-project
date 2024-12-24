import { createFileRoute } from '@tanstack/react-router'
import { MapNav } from '../../pages/mapNav/MapNav'
import { Loader } from '../../components/Loader';
import { MapFilter, UseGetAnnouncements } from '../../pages/announcements/announcements-utils';

export const Route = createFileRoute('/mapNav/')({
  component: RouteComponent,
  validateSearch: () => ({}) as MapFilter
})


function RouteComponent() {
  const filters = Route.useSearch();
  const { data, isLoading } = UseGetAnnouncements(filters);
  if (isLoading) {
    return <Loader />;
  }
  if (data) {
    return <MapNav announcements={data.announcement} categories={data.categories} filters={filters} />;
  }
}
 
import { createFileRoute } from '@tanstack/react-router'
import { MapAnnoun } from '../../../pages/announcements/mapForAnnoun/mapAnnoun';
import { Loader } from '../../../components/Loader';
import { UseGetAnnouncements } from '../../../pages/announcements/announcements-utils';

export const Route = createFileRoute('/announcements/mapForAnnoun/indes')({
  component: RouteComponent,
})

function RouteComponent() {
    const filters = Route.useSearch();
    const { data, isLoading } = UseGetAnnouncements(filters);
    if (isLoading) {
      return <Loader />;
    }
    if (data) {
      return <MapAnnoun announcements={data.announcement} categories={data.categories} filters={filters} />;
    }
  }

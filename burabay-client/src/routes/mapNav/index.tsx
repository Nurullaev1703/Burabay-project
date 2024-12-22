import { createFileRoute } from '@tanstack/react-router'
import { MapNav } from '../../pages/mapNav/MapNav'
import { Loader } from '../../components/Loader';
import { UseGetAnnouncement } from '../../pages/announcements/announcement/announcement-util';
import { UseGetAnnouncements } from '../../pages/announcements/announcements-utils';

export const Route = createFileRoute('/mapNav/')({
  component: RouteComponent,
})


function RouteComponent() {
  const { data, isLoading } = UseGetAnnouncements();
  if (isLoading) {
    return <Loader />;
  }

  if (data) {
    return <MapNav announcements={data.announcement} categories={data.categories} />;
  }
}
 
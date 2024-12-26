import { createFileRoute } from '@tanstack/react-router'
import { Schedule } from '../../../pages/announcements/announcement/schedule/Schedule'
import { Loader } from '../../../components/Loader';
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util';

export const Route = createFileRoute('/announcements/schedule/$announcementId')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
    const { announcementId } = Route.useParams();
    const { data, isLoading } = UseGetAnnouncement(announcementId);
    if (isLoading) {
      return <Loader />;
    }
  
    if (data) {
      return <Schedule announcement={data} />;
    }
}

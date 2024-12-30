import { createFileRoute } from '@tanstack/react-router'
import { Loader } from '../../../components/Loader';
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util';
import { Details } from '../../../pages/announcements/announcement/details/Details';

export const Route = createFileRoute('/announcements/details/$announcementId')({
  component: RouteComponent,
})

function RouteComponent() {
   const { announcementId } = Route.useParams();
      const { data, isLoading } = UseGetAnnouncement(announcementId);
      if (isLoading) {
        return <Loader />;
      }
    
      if (data) {
        return <Details announcement={data} />;
      }
}

import { createFileRoute } from '@tanstack/react-router'
import { UseGetAnnouncement, UseGetReviews } from '../../../pages/announcements/announcement/announcement-util';
import { Loader } from '../../../components/Loader';
import { AdminAnnoun } from '../../../pages/admin/announcements/AdminAnnoun';

export const Route = createFileRoute('/admin/announcements/$announcementId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { data: reviewData, isLoading: reviewIsLoading } = UseGetReviews(announcementId);
  const { data, isLoading } = UseGetAnnouncement(announcementId);

  if (isLoading && reviewIsLoading) {
    return <Loader />;
  }

  if (data && reviewData) {
    return <AdminAnnoun announcement={data} review={reviewData}/>;
  }
}

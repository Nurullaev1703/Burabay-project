import { createFileRoute } from '@tanstack/react-router'
import { UseGetAnnouncement, UseGetReviews } from '../../../pages/announcements/announcement/announcement-util';
import { Loader } from '../../../components/Loader';
import { ReviewPage } from '../../../pages/reviews/reviewsOrg/review-page/ReviewPage';

export const Route = createFileRoute('/reviews/reviewsOrg/$announcementId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { data: reviewsData, isLoading: isLoadingReview } =
    UseGetReviews(announcementId);

  if (isLoadingReview) return <Loader />;

  if (reviewsData)
    return (
      <ReviewPage review={reviewsData} />
    );
}

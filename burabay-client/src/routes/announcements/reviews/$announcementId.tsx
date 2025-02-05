import { createFileRoute } from "@tanstack/react-router";
import {
  UseGetAnnouncement,
  UseGetReviews,
} from "../../../pages/announcements/announcement/announcement-util";
import { Loader } from "../../../components/Loader";
import { ReviewsPage } from "../../../pages/announcements/reviews/ReviewsPage";

export const Route = createFileRoute("/announcements/reviews/$announcementId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { data: announcementData, isLoading: isLoadingAnnouncement } =
    UseGetAnnouncement(announcementId);
  const { data: reviewsData, isLoading: isLoadingReview } =
    UseGetReviews(announcementId);

  if (isLoadingAnnouncement && isLoadingReview) return <Loader />;

  if (announcementData && reviewsData)
    return (
      <ReviewsPage announcement={announcementData} review={reviewsData} />
    );
}

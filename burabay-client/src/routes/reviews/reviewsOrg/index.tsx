import { createFileRoute } from "@tanstack/react-router";
import { Reviews } from "../../../pages/reviews/reviewsOrg/Reviews";
import { ReviewsPage } from "../../../pages/reviews/reviewsOrg/reviews-page/ReviewsPage";
import { Loader } from "../../../components/Loader";
import { UseGetReviewsOrg } from "../../../pages/announcements/announcement/announcement-util";

export const Route = createFileRoute("/reviews/reviewsOrg/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: reviewsData, isLoading: isLoadingReview } = UseGetReviewsOrg();

  if (isLoadingReview) return <Loader />;

  if (reviewsData && reviewsData?.length > 0) {
    return <ReviewsPage reviews={reviewsData} />;
  } else {
    return <Reviews />;
  }
}

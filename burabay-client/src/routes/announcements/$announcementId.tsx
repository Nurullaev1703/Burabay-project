import { createFileRoute } from "@tanstack/react-router";
import { UseGetAnnouncement, UseGetReviews } from "../../pages/announcements/announcement/announcement-util";
import { Loader } from "../../components/Loader";
import { Announcement } from "../../pages/announcements/announcement/Announcement";

export const Route = createFileRoute("/announcements/$announcementId")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): { fromMap?: boolean } => {
    return {
      fromMap: search.fromMap === true || search.fromMap === 'true',
    };
  },
});

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { fromMap } = Route.useSearch();
  const { data: reviewData, isLoading: reviewIsLoading } = UseGetReviews(announcementId);
  const { data, isLoading } = UseGetAnnouncement(announcementId);

  if (isLoading && reviewIsLoading) {
    return <Loader />;
  }

  if (data && reviewData) {
    return <Announcement announcement={data} review={reviewData} fromMap={fromMap} />;
  }
}

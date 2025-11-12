import { createFileRoute } from "@tanstack/react-router";
import { UseGetAnnouncement } from "../../pages/announcements/announcement/announcement-util";
import { Loader } from "../../components/Loader";
import { Announcement } from "../../pages/announcements/announcement/Announcement";

export const Route = createFileRoute("/announcements/$announcementId")({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>
  ): { fromMap?: boolean; fromBusinessMap?: boolean } => {
    return {
      fromMap: search.fromMap === true || search.fromMap === "true",
      fromBusinessMap:
        search.fromBusinessMap === true || search.fromBusinessMap === "true",
    };
  },
});

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { fromMap, fromBusinessMap } = Route.useSearch();
  const { data, isLoading } = UseGetAnnouncement(announcementId);

  if (isLoading) {
    return <Loader />;
  }

  if (data) {
    return (
      <Announcement
        announcement={data}
        fromMap={fromMap}
        fromBusinessMap={fromBusinessMap}
      />
    );
  }
}

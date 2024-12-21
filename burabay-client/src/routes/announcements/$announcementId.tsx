import { createFileRoute } from "@tanstack/react-router";
import { UseGetAnnouncement } from "../../pages/announcements/announcement/announcement-util";
import { Loader } from "../../components/Loader";
import { Announcement } from "../../pages/announcements/announcement/Announcement";

export const Route = createFileRoute("/announcements/$announcementId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { data, isLoading } = UseGetAnnouncement(announcementId);
  if (isLoading) {
    return <Loader />;
  }

  if (data) {
    return <Announcement announcement={data} />;
  }
}

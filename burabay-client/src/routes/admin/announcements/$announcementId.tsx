import { createFileRoute } from "@tanstack/react-router";
import { UseGetAnnouncement } from "../../../pages/announcements/announcement/announcement-util";
import { Loader } from "../../../components/Loader";
import { AdminAnnoun } from "../../../pages/admin/announcements/AdminAnnoun";

export const Route = createFileRoute("/admin/announcements/$announcementId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { data, isLoading } = UseGetAnnouncement(announcementId);

  if (isLoading) {
    return <Loader />;
  }

  if (data) {
    return <AdminAnnoun announcement={data} />;
  }
}

import { createFileRoute } from "@tanstack/react-router";
import { BookingDate } from "../../../pages/announcements/booking-time/BookingDate";
import { Loader } from "../../../components/Loader";
import { UseGetAnnouncement } from "../../../pages/announcements/announcement/announcement-util";

export const Route = createFileRoute(
  "/announcements/booking-date/$announcementId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { data: announcementData, isLoading: announcementIsLoading } =
    UseGetAnnouncement(announcementId);
  if (announcementIsLoading) {
    return <Loader />;
  }
  if (announcementData) {
    return (
      <BookingDate announcement={announcementData} />
    );
  }
}

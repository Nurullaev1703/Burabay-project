import { createFileRoute } from "@tanstack/react-router";
import { BookingDate } from "../../../pages/announcements/booking-time/BookingDate";
import { Loader } from "../../../components/Loader";
import { UseGetAnnouncement, UseGetBannedDates } from "../../../pages/announcements/announcement/announcement-util";

export const Route = createFileRoute(
  "/announcements/booking-date/$announcementId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { data: announcementData, isLoading: announcementIsLoading } =
    UseGetAnnouncement(announcementId);
  const { data: datesData, isLoading: datesIsLoading } =
    UseGetBannedDates(announcementId);
  if (announcementIsLoading && datesIsLoading) {
    return <Loader />;
  }
  if (announcementData && datesData) {
    return (
      <BookingDate announcement={announcementData} bannedDates={datesData}/>
    );
  }
}

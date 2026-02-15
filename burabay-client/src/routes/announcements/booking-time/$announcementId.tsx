import { createFileRoute } from "@tanstack/react-router";
import {
  UseGetAnnouncement,
  UseGetBannedDates,
} from "../../../pages/announcements/announcement/announcement-util";
import { UseGetServiceSchedule } from "../../../pages/announcements/announcement/serviceSchedule/serviceSchedule-util";
import { Loader } from "../../../components/Loader";
import { BookingSelection } from "../../../pages/announcements/booking-time/BookingSelection";

export const Route = createFileRoute(
  "/announcements/booking-time/$announcementId"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { announcementId } = Route.useParams();
  const { data: announcementData, isLoading: announcementIsLoading } =
    UseGetAnnouncement(announcementId);
  const { data: bannedDatesData, isLoading: bannedDatesIsLoading } =
    UseGetBannedDates(announcementId);
  const { data: serviceScheduleData, isLoading: serviceScheduleIsLoading } =
    UseGetServiceSchedule(announcementId);

  if (
    announcementIsLoading ||
    bannedDatesIsLoading ||
    serviceScheduleIsLoading
  ) {
    return <Loader />;
  }

  if (announcementData) {
    return (
      <BookingSelection
        announcement={announcementData}
        bannedDates={bannedDatesData}
        serviceSchedule={serviceScheduleData}
      />
    );
  }
}

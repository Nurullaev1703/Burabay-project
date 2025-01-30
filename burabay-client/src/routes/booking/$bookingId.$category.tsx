import { createFileRoute } from "@tanstack/react-router";
import { SelectedBooking } from "../../pages/booking/booking-page/selected-booking/SelectedBooking";
import { useGetBooking } from "../../pages/booking/booking-util";
import { Loader } from "../../components/Loader";
import { UseGetAnnouncement } from "../../pages/announcements/announcement/announcement-util";

export const Route = createFileRoute("/booking/$bookingId/$category")({
  component: RouteComponent,
});

function RouteComponent() {
  const { bookingId, category } = Route.useParams();
  const { data, isLoading } = useGetBooking(bookingId, category);
  const { data: announcementData, isLoading: announcementIsLoading } =
    UseGetAnnouncement(bookingId);
  if (isLoading && announcementIsLoading) return <Loader />;
  if (data && announcementData)
    return <SelectedBooking booking={data} announcement={announcementData} />;
}

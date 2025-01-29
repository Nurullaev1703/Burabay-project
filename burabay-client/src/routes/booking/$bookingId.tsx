import { createFileRoute } from "@tanstack/react-router";
import { SelectedBooking } from "../../pages/booking/booking-page/selected-booking/SelectedBooking";
import { useGetBooking } from "../../pages/booking/booking-util";
import { Loader } from "../../components/Loader";

export const Route = createFileRoute("/booking/$bookingId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { bookingId } = Route.useParams();
  const { data, isLoading } = useGetBooking(bookingId);
  if (isLoading) return <Loader />;
  if (data) return <SelectedBooking booking={data} />;
}

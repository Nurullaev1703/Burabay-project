import { createFileRoute } from "@tanstack/react-router";
import { BookingBusiness } from "../../pages/booking/BookingBusiness";
import { useGetBooking } from "../../pages/booking/booking-util";
import { Loader } from "../../components/Loader";
import { BookingPage } from "../../pages/booking/booking-page/BookingPage";

export const Route = createFileRoute("/booking/business")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useGetBooking();
  if (isLoading) {
    return <Loader />;
  }

  if (data) {
    return <BookingPage />;
  } else {
    return <BookingBusiness />;
  }
}

import { createFileRoute, useLocation } from "@tanstack/react-router";
import { BookingBusiness } from "../../pages/booking/BookingBusiness";
import { useGetBookings } from "../../pages/booking/booking-util";
import { Loader } from "../../components/Loader";
import { BookingPage } from "../../pages/booking/booking-page/BookingPage";

export const Route = createFileRoute("/booking/business")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const onlinePayment = queryParams.get("onlinePayment") === "true";
  const onSidePayment = queryParams.get("onSidePayment") === "true";
  const canceled = queryParams.get("canceled") === "true";

  const { data = [], isLoading } = useGetBookings(
    onlinePayment,
    onSidePayment,
    canceled
  );

  if (isLoading) {
    return <Loader />;
  }

  const hasParams = onlinePayment || onSidePayment || canceled;

  if (data.length === 0 && !hasParams) {
    return <BookingBusiness />;
  }
  return <BookingPage ads={data} />;
}

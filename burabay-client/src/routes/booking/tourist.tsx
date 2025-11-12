import { createFileRoute, useLocation } from "@tanstack/react-router";
import { BookingTourist } from "../../pages/booking/BookingTourist";
import { Loader } from "../../components/Loader";
import { useGetTouristBookings } from "../../pages/booking/booking-util";
import { BookingPage } from "../../pages/booking/toursit/BookingPage";

export const Route = createFileRoute("/booking/tourist")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();

  /* @ts-ignore */
  const queryParams = new URLSearchParams(location.search);

  const onlinePayment = queryParams.get("onlinePayment") === "true";
  const onSidePayment = queryParams.get("onSidePayment") === "true";
  const canceled = queryParams.get("canceled") === "true";
  const status = queryParams.get("status") || "ACTIVE";

  const { data = [], isLoading } = useGetTouristBookings(
    onlinePayment,
    onSidePayment,
    canceled,
    status
  );

  if (isLoading) {
    return <Loader />;
  }

  // Если нет данных, показываем пустую страницу без поиска и фильтра
  if (data.length === 0) {
    return <BookingTourist />;
  }
  /* @ts-ignore */
  return <BookingPage ads={data} />;
}

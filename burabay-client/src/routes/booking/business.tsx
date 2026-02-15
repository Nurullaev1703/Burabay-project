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
  const queryParams = new URLSearchParams(location.search as string);

  const onlinePayment = queryParams.get("onlinePayment") === "true";
  const onSidePayment = queryParams.get("onSidePayment") === "true";
  const canceled = queryParams.get("canceled") === "true";
  const status = queryParams.get("status") || "ACTIVE";

  const { data = [], isLoading } = useGetBookings(
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
    return <BookingBusiness />;
  }
  
  return <BookingPage ads={data} />;
}

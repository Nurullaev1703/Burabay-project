import { createFileRoute } from "@tanstack/react-router";
import { BookingTourist } from "../../pages/booking/BookingTourist";
import { Loader } from "../../components/Loader";
import { useGetTouristBookings } from "../../pages/booking/booking-util";
import { BookingPage } from "../../pages/booking/toursit/BookingPage";
import { BookingPageFilter } from "../../pages/booking/model/booking";

export const Route = createFileRoute("/booking/tourist")({
  component: RouteComponent,
  validateSearch: () => ({}) as BookingPageFilter,
});

function RouteComponent() {
  const filters = Route.useSearch();

  const { data, isLoading } = useGetTouristBookings(filters);

  if (isLoading) {
    return <Loader />;
  }

  const hasParams =
    filters.onlinePayment || filters.onSidePayment || filters.canceled;

  if (data?.length === 0 && !hasParams) {
    return <BookingTourist />;
  }
  return <BookingPage ads={data ?? []} filters={filters} />;
}

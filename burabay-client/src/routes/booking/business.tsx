import { createFileRoute } from "@tanstack/react-router";
import { BookingBusiness } from "../../pages/booking/BookingBusiness";
import { useGetBookings } from "../../pages/booking/booking-util";
import { Loader } from "../../components/Loader";
import { BookingPage } from "../../pages/booking/booking-page/BookingPage";
import { BookingPageFilter } from "../../pages/booking/model/booking";

export const Route = createFileRoute("/booking/business")({
  component: RouteComponent,
  validateSearch: () => ({}) as BookingPageFilter,
});

function RouteComponent() {
  const filters = Route.useSearch();
  const { data, isLoading } = useGetBookings(filters);

  if (isLoading) {
    return <Loader />;
  }

  const hasParams =
    filters.onlinePayment || filters.onSidePayment || filters.canceled;

  if (data?.length === 0 && !hasParams) {
    return <BookingBusiness />;
  }

  return <BookingPage ads={data ?? []} filters={filters} />;
}

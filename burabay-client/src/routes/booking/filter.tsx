import { createFileRoute } from "@tanstack/react-router";
import { FilterPage } from "../../pages/booking/booking-page/FilterPage";
import { BookingPageFilter } from "../../pages/booking/model/booking";

export const Route = createFileRoute("/booking/filter")({
  component: RouteComponent,
  validateSearch: () => ({}) as BookingPageFilter,
});

function RouteComponent() {
  const filters = Route.useSearch();
  return <FilterPage filters={filters} />;
}

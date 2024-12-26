import { createFileRoute } from '@tanstack/react-router'
import { BookingBusiness } from "../../pages/booking/BookingBusiness";

export const Route = createFileRoute("/booking/business")({
  component: BookingBusiness,
});

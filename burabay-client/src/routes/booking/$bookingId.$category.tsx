import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SelectedBooking } from "../../pages/booking/booking-page/selected-booking/SelectedBooking";
import { useGetBooking } from "../../pages/booking/booking-util";
import { Loader } from "../../components/Loader";
import { UseGetAnnouncement } from "../../pages/announcements/announcement/announcement-util";
import { useEffect } from "react";
import { queryClient } from "../../ini/InitializeApp";
import { roleService } from "../../services/storage/Factory";

export const Route = createFileRoute("/booking/$bookingId/$category")({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as string) || "ACTIVE",
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { bookingId, category } = Route.useParams();
  const { status } = Route.useSearch();
  const { data, isLoading } = useGetBooking(bookingId, category, status);
  const { data: announcementData, isLoading: announcementIsLoading } =
    UseGetAnnouncement(bookingId);
  
  // Проверяем, если bookings пустой массив, перенаправляем на страницу броней
  useEffect(() => {
    if (data && (!data.bookings || data.bookings.length === 0)) {
      // Инвалидируем кеш перед редиректом
      queryClient.invalidateQueries({ queryKey: [`/booking/org`] });
      queryClient.invalidateQueries({ queryKey: [`/booking/by-ad`], refetchType: "all" });
      
      // Определяем роль пользователя и перенаправляем на соответствующую страницу
      const userRole = roleService.hasValue() ? roleService.getValue() : null;
      const bookingRoute = userRole === "BUSINESS" ? "/booking/business" : "/booking/tourist";
      
      navigate({ to: bookingRoute });
    }
  }, [data, navigate]);
  
  if (isLoading && announcementIsLoading) return <Loader />;
  if (data && announcementData && data.bookings && data.bookings.length > 0)
    return <SelectedBooking booking={data} announcement={announcementData} />;
  
  return <Loader />;
}

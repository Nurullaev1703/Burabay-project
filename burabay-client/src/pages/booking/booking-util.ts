import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import {
  BookingList,
  BookingPageFilter,
  TouristBookingList,
  TSelectedBooking,
} from "./model/booking";

export function useGetBookings(filters?: BookingPageFilter) {
  // Формируем строку параметров запроса
  const onlinePaymentFilter = filters?.onlinePayment || "";
  const onSidePaymentFilter = filters?.onSidePayment || "";
  const canceledFilter = filters?.canceled || "";

  // Строим URL с параметрами
  const url = `/booking/org?onlinePayment=${onlinePaymentFilter}&onSidePayment=${onSidePaymentFilter}&canceled=${canceledFilter}`;

  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await apiService.get<BookingList[]>({
        url: url,
      });
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
  });
}

export function useGetTouristBookings(filters?: BookingPageFilter) {
  // Формируем строку параметров запроса
  const onlinePaymentFilter = filters?.onlinePayment || "";
  const onSidePaymentFilter = filters?.onSidePayment || "";
  const canceledFilter = filters?.canceled || "";

  // Строим URL с параметрами
  const url = `/booking/?onlinePayment=${onlinePaymentFilter}&onSidePayment=${onSidePaymentFilter}&canceled=${canceledFilter}`;

  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const response = await apiService.get<TouristBookingList[]>({
        url: url,
      });
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
  });
}

export function useGetBooking(bookingId: string, category: string) {
  return useQuery({
    queryKey: [`/booking/by-ad/${bookingId}/${category}`],
    queryFn: async () => {
      const response = await apiService.get<TSelectedBooking>({
        url: `/booking/by-ad/${bookingId}/${category}`,
      });
      return response.data;
    },
  });
}

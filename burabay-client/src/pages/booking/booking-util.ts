import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { BookingList, TSelectedBooking } from "./model/booking";

export function useGetBookings(
  onlinePayment: boolean | null = false,
  onSidePayment: boolean | null = false,
  canceled: boolean | null = false
) {
  // Формируем строку параметров запроса
  const queryParams = new URLSearchParams();

  if (onlinePayment) queryParams.set("onlinePayment", "true");
  if (onSidePayment) queryParams.set("onSidePayment", "true");
  if (canceled) queryParams.set("canceled", "true");

  // Строим URL с параметрами
  const url = `/booking/org?${queryParams.toString()}`;

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

export function useGetTouristBookings(
  onlinePayment: boolean | null = false,
  onSidePayment: boolean | null = false,
  canceled: boolean | null = false
) {
  // Формируем строку параметров запроса
  const queryParams = new URLSearchParams();

  if (onlinePayment) queryParams.set("onlinePayment", "true");
  if (onSidePayment) queryParams.set("onSidePayment", "true");
  if (canceled) queryParams.set("canceled", "true");

  // Строим URL с параметрами
  const url = `/booking/?${queryParams.toString()}`;

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

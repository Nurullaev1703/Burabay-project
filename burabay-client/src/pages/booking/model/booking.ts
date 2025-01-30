import { PaymentType } from "../../announcements/booking/Booking";

interface BookingAd {
  title: string;
  ad_id: string;
  img: string;
  times: string[];
}

export interface BookingList {
  header: string;
  ads: BookingAd[];
}

export interface TSelectedBooking {
  date: string;
  image: string;
  title: string;
  type: "Услуга" | "Аренда",
  bookings: SelectedBookingList[];
}

export interface SelectedBookingList {
  bookingId: string;
  rate: string;
  avatar: string;
  isPaid: boolean;
  name: string;
  payment_method: PaymentType;
  price: number;
  status: string;
  time: string;
  user_number: string;
  date?: string;
  dateEnd?: string;
}

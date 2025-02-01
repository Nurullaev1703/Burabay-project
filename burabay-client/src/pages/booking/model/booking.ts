import { PaymentType } from "../../announcements/booking/Booking";

interface BookingAd {
  title: string;
  ad_id: string;
  img: string;
  times: string[];
}
interface TouristBookingAd {
  title: string;
  ad_id: string;
  img: string;
  times: TouristBookingTime[];
}

interface TouristBookingTime {
  time: string;
  status: "в процессе" | "отменено";
  price: number;
  isPaid: boolean;
  paymentType: "online" | "cash";
}

export interface BookingList {
  header: string;
  ads: BookingAd[];
}

export interface TSelectedBooking {
  date: string;
  image: string;
  title: string;
  type: "Услуга" | "Аренда";
  bookings: SelectedBookingList[];
}

export interface TouristBookingList {
  header: string;
  ads: TouristBookingAd[];
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

import { Profile } from "../../profile/model/profile";

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategories[];
  description: string;
  imgPath: string;
  details: string[];
}

export interface Subcategory {
  name: string;
  id: string;
  category: Category;
  ads: string[];
}

export interface Subcategories {
  id: string;
  name: string;
}
export interface AnnouncementSchedule {
  id: string;
  monStart: string;
  monEnd: string;
  tueStart: string;
  tueEnd: string;
  wenStart: string;
  wenEnd: string;
  thuStart: string;
  thuEnd: string;
  friStart: string;
  friEnd: string;
  satStart: string;
  satEnd: string;
  sunStart: string;
  sunEnd: string;
}

export interface AnnouncementBreaks {
  id: string;
  start: string;
  end: string;
}
export interface BookingBanDate {
  id: string;
  allDay: boolean;
  date: string;
  times: string[];
}

export interface AnnouncementDetails {
  type?: string;
  bicycles?: boolean;
  electricScooters?: boolean;
  campingEquipment?: boolean;
  carRentalWithDriver?: boolean;
  barbecueArea?: boolean;
  equippedBeach?: boolean;
  restingCanopy?: boolean;
  wildBeach?: boolean;
}

interface AnnouncementOrganization {
  id: string;
  imgUrl: string;
  name: string;
  rating: number;
  reviewCount: number;
  isConfirmed: boolean;
  description: string;
  siteUrl: string;
}
export interface Announcement {
  subcategory: Subcategory;
  address: location;
  id: string;
  title: string;
  description: string;
  images: string[];
  phoneNumber: string;
  details: AnnouncementDetails;
  youtubeLink: string;
  isRoundTheClock: boolean;
  isFullDay: boolean;
  startTime: string[];
  isDuration: boolean;
  duration: string;
  unlimitedClients: boolean;
  adultsNumber: number;
  kidsNumber: number;
  kidsMinAge: number;
  isFavourite: boolean;
  petsAllowed: boolean;
  isBookable: boolean;
  price: number;
  priceForChild: number;
  onSitePayment: null;
  onlinePayment: null;
  isBlocked: boolean;
  isComplete: boolean;
  createdAt: Date;
  organization: AnnouncementOrganization;
  breaks: Breaks[];
  schedule: Schedule;
  views: number;
  favCount: number;
  avgRating: number;
  reviewCount: number;
  bookingBanDate: BookingBanDate[];
}

export interface location {
  id: string;
  organizationId: string;
  adId: string;
  address: string;
  specialName: string;
  latitude: number;
  longitude: number;
}

export interface Schedule {
  adId: string;
  id?: string;
  monStart: string;
  monEnd: string;
  tueStart: string;
  tueEnd: string;
  wenStart: string;
  wenEnd: string;
  thuStart: string;
  thuEnd: string;
  friStart: string;
  friEnd: string;
  satStart: string;
  satEnd: string;
  sunStart: string;
  sunEnd: string;
}

export interface Breaks {
  adId: string;
  start: string;
  end: string;
}

export interface Booking {
  id: string;
  date: string;
  allDay: boolean;
  times: string[];
}

export interface ReviewAnnouncement {
  adId: string;
  adTitle: string;
  adImage: string;
  adAvgRating: string;
  adReviewCount: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  images: string[];
  text: string;
  stars: number;
  date: Date;
  isCheked: boolean;
  isNew: boolean;
  user: Profile;
  answer: ReviewAnswer;
  report: ReviewAnswer;
}

interface ReviewAnswer {
  date: string;
  id: string;
  text: string;
}

export interface ReviewsOrg {
  adId: string;
  adTitle: string;
  adImage: string;
  adAvgRating: string;
  newReviews: number;
}

export interface OrgInfo {
  description: string;
  name: string;
  siteUrl: string;
  imgUrl: string;
  id: string;
  isConfirmed: boolean;
  ads: Announcement[];
}

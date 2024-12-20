export interface Category {
  id: string;
  name: string;
  subcategories: Subcategories[];
  description: string;
  imgPath: string;
  details: string[];
}

export interface Subcategories {
  id: string;
  name: string;
}
export interface AnnouncementSchedule {
  id:string;
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

interface AnnouncementDetails {
  type: string;
  bicycles: boolean;
  electricScooters: boolean;
  campingEquipment: boolean;
  carRentalWithDriver: boolean;
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
  startTime: string;
  isDuration: boolean;
  duration: string;
  unlimitedClients: boolean;
  adultsNumber: number;
  kidsNumber: number;
  kidsMinAge: number;
  petsAllowed: boolean;
  isBookable: boolean;
  price: boolean;
  priceForChild: number;
  onSitePayment: null;
  onlinePayment: null;
  isBlocked: boolean;
  isComplete: boolean;
  createdAt: Date;
  organization: AnnouncementOrganization;
  breaks: string[];
  schedule: string;
  views: number;
  favCount: number;
}

export interface location {
  organizationId: string;
  adId: string;
  address: string;
  specialName: string
  latitude: number;
  longitude: number;
}
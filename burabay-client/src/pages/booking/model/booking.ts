interface BookingAd {
  title: string;
  ad_id: string;
  img: string;
  times: string[];
}

export interface BookingList {
    header: string;
    ads: BookingAd[]
}

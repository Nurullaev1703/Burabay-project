import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../services/api/ApiService";
import {
  Announcement,
  ReviewAnnouncement,
  ReviewsOrg,
} from "../model/announcements";

export function UseGetAnnouncement(announcementId: string) {
  return useQuery({
    queryKey: [`/ad/${announcementId}`, announcementId],
    queryFn: async () => {
      const response = await apiService.get<Announcement>({
        url: `/ad/${announcementId}`,
      });
      return response.data;
    },
  });
}

export function UseGetReviews(announcementId: string) {
  return useQuery({
    queryKey: [`/review/ad/`, announcementId],
    queryFn: async () => {
      const response = await apiService.get<ReviewAnnouncement>({
        url: `/review/ad/${announcementId}`,
      });
      return response.data;
    },
  });
}

export function UseGetReviewsOrg() {
  return useQuery({
    queryKey: ["/review"],
    queryFn: async () => {
      const response = await apiService.get<ReviewsOrg[]>({
        url: "/review",
      });
      return response.data;
    },
  });
}

export function UseGetBannedDates(announcementId: string) {
  return useQuery({
    queryKey: [`/ad/check-dates/${announcementId}`],
    queryFn: async () => {
      const response = await apiService.get<any>({
        url: `/ad/check-dates/${announcementId}/{startDate}/{endDate}`,
      });
      return response.data;
    },
  });
}

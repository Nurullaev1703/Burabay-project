import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../services/api/ApiService";
import { Announcement, Review } from "../model/announcements";

export function UseGetAnnouncement(announcementId: string) {
    return useQuery({
        queryKey: [`/ad/${announcementId}`, announcementId],
        queryFn: async() => {
            const response = await apiService.get<Announcement>({
                url: `/ad/${announcementId}`
            })
            return response.data
        }
    })
}

export function UseGetReviews(announcementId: string) {
    return useQuery({
        queryKey: [`/review/ad/${announcementId}`],
        queryFn: async () => {
            const response = await apiService.get<Review[]>({
                url: `/review/ad/${announcementId}`
            })
            return response.data
        }
    })
}

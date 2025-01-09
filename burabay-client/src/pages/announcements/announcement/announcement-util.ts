import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../services/api/ApiService";
import { Announcement, AnnouncementBreaks } from "../model/announcements";

export function UseGetAnnouncement(announcementId: string) {
    return useQuery({
        queryKey: [`/ad/${announcementId}`],
        queryFn: async() => {
            const response = await apiService.get<Announcement>({
                url: `/ad/${announcementId}`
            })
            return response.data
        }
    })
}

export function UseGetBreak(announcementId: string) {
    return useQuery({
        queryKey: [`/breaks/${announcementId}`],
        queryFn: async () => {
            const response = await apiService.get<AnnouncementBreaks[]>({
                url: `/breaks/${announcementId}`
            })
            return response.data
        }
    })
}

import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../../services/api/ApiService";
import { Booking } from "../../model/announcements";

export function UseGetServiceSchedule(announcementId: string) {
    return useQuery({
        queryKey: [`/booking-ban-date/${announcementId}`],
        queryFn: async () => {
            const response = await apiService.get<Booking[]>({
                url: `/booking-ban-date/${announcementId}`
            });
            return response.data
        }
    })
}
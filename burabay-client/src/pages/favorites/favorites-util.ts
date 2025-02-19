import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { Announcement } from "../announcements/model/announcements";

export function UseGetFavorites() {
    return useQuery({
        queryKey: ['ad/favorite/list'],
        queryFn: async () => {
            const response = await apiService.get<Announcement[]>({
                url: '/ad/favorite/list'
            });
            return response.data
        }
    })
}
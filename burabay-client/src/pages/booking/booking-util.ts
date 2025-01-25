import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";

export function useGetBooking() {
    return useQuery({
        queryKey: ["/booking/org"],
        queryFn: async () => {
            const response = await apiService.get<any>({
                url: "/booking/org"
            })
            return response.data
        }
    })
}

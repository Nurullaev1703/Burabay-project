import { useQuery } from "@tanstack/react-query"
import { apiService } from "../../services/api/ApiService"
import { Profile } from "./model/profile"

export function useGetProfile(){
    return useQuery({
      queryKey: ['profile'],
      queryFn: async () => {
        const response = await apiService.get<Profile>({
          url: "/profile",
        });
        return response.data;
      },
    });
}
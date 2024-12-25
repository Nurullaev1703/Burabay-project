import { useQuery } from "@tanstack/react-query"
import { apiService } from "../../services/api/ApiService"
import { Profile as ProfileType } from "./model/profile"

export function useGetProfile(){
    return useQuery({
      queryKey: ["profile"],
      queryFn: async () => {
        const response = await apiService.get<ProfileType>({
          url: "/profile",
        });
        return response.data;
      },
      staleTime: 1000
    });
}
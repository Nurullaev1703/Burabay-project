import { useQuery } from "@tanstack/react-query"
import { apiService } from "../../services/api/ApiService"
import { Profile as ProfileType } from "./model/profile"
import { tokenService } from "../../services/storage/Factory";

export function useGetProfile() {
  // изменение токена должно отражаться на профиле
  const token = tokenService.hasValue() ? tokenService.getValue() : null
    return useQuery({
      queryKey: ['profile', token],
      queryFn: async () => {
        const response = await apiService.get<ProfileType>({
          url: "/profile",
        });
        return response.data;
      },
    });
}
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../services/api/ApiService";
import { Profile } from "../../profile/model/profile";
import { Notification } from "./model/notifications";

export function useGetProfileUser(){
    return useQuery({
      queryKey: ['profile'],
      queryFn: async () => {
        const response = await apiService.get<Profile>({
          url: "/profile/users",
        });
        return response.data;
      },
    });
}

export function useGetNotification(){
    return useQuery({
        queryKey: ["/notification"],
        queryFn: async () =>{
            const notification = await apiService.get<Notification[]>({
                url: "/notification",
            });
            return notification.data
        }
    })
}
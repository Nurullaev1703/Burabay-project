import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../services/api/ApiService";

export interface NotificationType {
    id:string;
    date:Date;
    title: string
}

export function useGetNotifications(){
    return useQuery({
        queryKey:['notifications'],
        queryFn:async()=>{
            const response = await apiService.get<NotificationType[]>({
                url:"/notifications"
            })
            return response.data
        }
    })
}
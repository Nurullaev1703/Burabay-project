import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { Category } from "./model/announcements";

export function useGetCategory(){
    return useQuery({
        queryKey: ["/category"],
        queryFn: async () =>{
            const category = await apiService.get<Category>({
                url: "/category",
            });
            return category.data
        }
    })
}
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { Announcement, Category } from "../announcements/model/announcements";

export interface MainDataType{
    ads: Announcement[],
    categories: Category[]
}

export function useGetMainPage() {
  return useQuery({
    queryKey: ["main-page"],
    queryFn: async () => {
      const response = await apiService.get<MainDataType>({
        url: "/main-pages",
      });
      return response.data;
    },
  });
}

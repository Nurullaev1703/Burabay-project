import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { Announcement, Category } from "../announcements/model/announcements";
import { MapFilter } from "pages/announcements/announcements-utils";

export interface MainDataType{
    ads: Announcement[],
    categories: Category[]
}

export function useGetMainPage(filters?:MapFilter) {
  const categoryFilter = filters?.category || "";
  const adNameFilter = filters?.adName || "";
  return useQuery({
    queryKey: ["main-page",filters],
    queryFn: async () => {
      const response = await apiService.get<MainDataType>({
        url: `/main-pages?category=${categoryFilter}&adName=${adNameFilter}`,
      });
      return response.data;
    },
  });
}

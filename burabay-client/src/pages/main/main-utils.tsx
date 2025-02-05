import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { Announcement, Category } from "../announcements/model/announcements";
import { MapFilter } from "../announcements/announcements-utils";

export interface MainDataType{
    ads: Announcement[],
    categories: Category[]
}

export function useGetMainPageAnnouncements(filters?:MapFilter) {
  const categoryFilter = filters?.category || "";
  const adNameFilter = filters?.adName || "";
  return useInfiniteQuery({
    queryKey: ["main-page-announcements", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get<Announcement[]>({
        url: `/main-pages/announcements?category=${categoryFilter}&adName=${adNameFilter}&offset=${pageParam}&limit=10`,
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined;
    },
  });
}


export function useGetMainPageCategories() {
  return useQuery({
    queryKey: ["main-page-categories"],
    queryFn: async () => {
      const response = await apiService.get<Category[]>({
        url: `/main-pages/categories`,
      });
      return response.data;
    },
  });
}

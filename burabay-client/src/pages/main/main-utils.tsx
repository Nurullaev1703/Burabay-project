import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { Announcement, Category } from "../announcements/model/announcements";
import { MainPageFilter } from "./model/mainpage-types";

export interface MainDataType{
    ads: Announcement[],
    categories: Category[]
}

export function useGetMainPageAnnouncements(filters?:MainPageFilter) {
  const categoryFilter = filters?.category || "";
  const adNameFilter = filters?.adName || "";
  const subcategoryFilter = filters?.subcategories || "";
  const minPrice = filters?.minPrice || "";
  const maxPrice = filters?.maxPrice || "";
  const rating = filters?.isHighRating || "";
  const subcategoriesString = Array.isArray(subcategoryFilter) ? subcategoryFilter.join(",") : "";
  return useInfiniteQuery({
    queryKey: ["main-page-announcements", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get<Announcement[]>({
        url: `/main-pages/ad?category=${categoryFilter}&adName=${adNameFilter}&minPrice=${minPrice}&maxPrice=${maxPrice}&rating=${rating ? "4.5" : ""}&subcategories=${subcategoriesString}&offset=${pageParam}&limit=10`,
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
export function useGetMainPageCategory(categoryId: string) {
  return useQuery({
    queryKey: ["main-page-category"],
    queryFn: async () => {
      const response = await apiService.get<Category>({
        url: `/category/${categoryId}`,
      });
      return response.data;
    },
  });
}

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { Announcement, Category } from "../announcements/model/announcements";
import { MainPageFilter } from "./model/mainpage-types";

export interface MainDataType {
  ads: Announcement[];
  categories: Category[];
}

export function useGetMainPageAnnouncements(filters?: MainPageFilter) {
  const categoryFilter = filters?.category || "";
  const adNameFilter = filters?.adName || "";
  const subcategoryFilter = filters?.subcategories?.join(",") || "";
  const minPrice = filters?.minPrice || "";
  const maxPrice = filters?.maxPrice || "";
  const rating = filters?.isHighRating || "";
  const detailsFilter = filters?.details?.join(",") || "";
  return useInfiniteQuery({
    queryKey: ["main-page-announcements", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get<Announcement[]>({
        url: `/main-pages/ad?category=${categoryFilter}&name=${adNameFilter}&minPrice=${minPrice}&maxPrice=${maxPrice}&isHighRating=${rating ? "true" : ""}&subcategories=${subcategoryFilter}&details=${detailsFilter}&offset=${pageParam}&limit=10`,
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined;
    },
  });
}

export function useGetRecommendedAds(filters?: MainPageFilter) {
  return useInfiniteQuery({
    queryKey: ["recommended-ads", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get<Announcement[]>({
        url: `/category/favorite/ads?offset=${pageParam}`,
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
      const categories = await apiService.get<Category[]>({
        url: `/main-pages/categories`,
      });
      const favouriteCategories = await apiService.get<Category[]>({
        url: `/category/favorite/list`,
      });
      return {
        categories: categories.data,
        favouriteCategories: favouriteCategories.data,
      };
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

export interface Banner {
  id: string;
  imagePath: string;
  title: string;
  text: string;
  deleteDate: string;
}

export function useGetMainPageBanners() {
  return useQuery({
    queryKey: ["main-page-banners"],
    queryFn: async () => {
      const response = await apiService.get<{
        data: Banner[];
        total: number;
        hasMore: boolean;
      }>({
        url: "/main-pages/banners",
      });
      return response.data?.data || [];
    },
  });
}

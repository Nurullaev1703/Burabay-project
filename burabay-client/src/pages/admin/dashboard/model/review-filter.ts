import { useInfiniteQuery } from "@tanstack/react-query";
import { apiService } from "../../../../services/api/ApiService";

export interface ReviewsFilter {
  search?: string;
  skip?: number;
  take?: number;
}

export function useGetReviews(filters: ReviewsFilter) {
  const take = filters.take ?? 8;
  const search = filters.search ?? "";

  return useInfiniteQuery({
    queryKey: ["admin-reviews", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get<any[]>({
        url: `/review/all?skip=${pageParam}&take=${take}&search=${search}`,
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === take ? allPages.length * take : undefined;
    },
  });
}
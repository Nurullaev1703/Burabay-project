import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { Announcement, Category, Subcategories } from "./model/announcements";


export function useGetCategory(){
    return useQuery({
        queryKey: ["/categories"],
        queryFn: async () =>{
            const category = await apiService.get<Category[]>({
                url: "/category",
            });
            return category.data
        }
    })
}
export function useGetCategoryId(categoryId: string){
    return useQuery({
        queryKey: ["/category" , categoryId],
        queryFn: async () =>{
            const category = await apiService.get<Category>({
                url: `/category/${categoryId}`,
            });
            return category.data
        }
    })
}

export function useGetCategorySubcategoryId(categoryId: string , subcategoryId: string){
    return useQuery({
        queryKey:["/subcategory" , categoryId,subcategoryId],
        queryFn: async () =>{
            const category = await apiService.get<Category>({
                url: `/category/${categoryId}`,
            });
            const subcategory = await apiService.get<Subcategories>({
                url: `/subcategory/${subcategoryId}`
            })
            return {category: category.data , subcategory: subcategory.data}

        }
    })
}

export interface MapFilter {
  categoryNames?: string;
  adName?: string;
  category?: string;
  limit?: number;
  offset?: number;
}
export function UseGetAnnouncements(filters?: MapFilter) {
    const categoryFilter = filters?.categoryNames || ""
    const adNameFilter = filters?.adName || ""
    return useQuery({
        queryKey: [`/map` , filters],
        queryFn: async() => {
            const response = await apiService.get<Announcement[]>({
                url: `/ad?categoryNames=${categoryFilter}&adName=${adNameFilter}`
            })
            const category = await apiService.get<Category[]>({
                url: "/category"
            })
            return {announcement: response.data, categories: category.data}
        }
    })
}

export function UseGetOrganizationAnnouncements(
  orgId: string,
  filters?: MapFilter
) {
  return useInfiniteQuery({
    queryKey: [`ad-organization`, orgId, filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get<Announcement[]>({
        url: `/ad/by-org/${orgId}?adName=${filters?.adName || ""}&offset=${pageParam}&limit=10`,
      });
      return response.data;
    },

    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined;
    },
  });
}

export function UseGetOrganizationAnnouncementsTwo(
    orgId: string,
    filters?: MapFilter
  ) {
    return useQuery({
      queryKey: [`ad-organization`, orgId, filters],
      queryFn: async ({ pageParam = 0 }) => {
        const response = await apiService.get<Announcement[]>({
          url: `/ad/by-org/${orgId}?adName=${filters?.adName || ""}&offset=${pageParam}&limit=10`,
        });
        return response.data;
      },
    });
  }

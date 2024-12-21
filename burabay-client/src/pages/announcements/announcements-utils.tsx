import { useQuery } from "@tanstack/react-query";
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

export function UseGetAnnouncements() {
    return useQuery({
        queryKey: [`/map`],
        queryFn: async() => {
            const response = await apiService.get<Announcement[]>({
                url: `/ad`
            })
            return response.data
        }
    })
}
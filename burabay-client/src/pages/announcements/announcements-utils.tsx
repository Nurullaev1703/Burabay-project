import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../services/api/ApiService";
import { Category, Subcategories } from "./model/announcements";

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
                url: `/category/${categoryId}/${subcategoryId}`,
            });
            return category.data
        }
    })
}

            // const subcategory = await apiService.get<Subcategories>({
            //     url: `/category/${category.data.id}/${subcategoryId}`
            // })
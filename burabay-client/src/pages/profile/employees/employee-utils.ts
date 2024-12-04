import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../services/api/ApiService";
import { EmployeeType } from "./model/employee-type";

export function useGetEmployees(filialId:string){
    return useQuery({
        queryKey:['employees' , filialId],
        queryFn:async()=>{
            const response = await apiService.get<EmployeeType[]>({
                url:`/employees/filial/${filialId}`
            })
            return response.data
        }
    })
}

export function useGetEmployee(employeeId:string){
    return useQuery({
        queryKey:['employee' , employeeId],
        queryFn:async()=>{
            const response = await apiService.get<EmployeeType>({
                url:`/employees/${employeeId}`
            })
            return response.data
        }
    })
}
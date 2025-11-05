import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../../services/api/ApiService";
import { Profile } from "../../../profile/model/profile";

export enum UsersFilterStatus {
  BAN = "заблокирован",
  WAITING = "ожидает подтверждения",
}
export enum RoleType {
  TOURIST = "турист",
  BUSINESS = "бизнес",
  ADMIN = "admin",
}

export interface UsersFilter {
  searchQuery?: string; // Универсальный поиск по email, phone, name организации
  role?: RoleType;
  status?: UsersFilterStatus;
  page?: number;
  take?: number; // Количество записей на странице
}

export interface UsersResponse {
  data: Profile[];
  total: number;
  page: number;
  take: number;
  totalPages: number;
}

export function useGetUsers(filters: UsersFilter) {
  const searchQuery = filters.searchQuery ?? "";
  const role = filters.role ?? "";
  const status = filters.status ?? "";
  const page = filters.page ?? 1;
  const take = filters.take ?? 10;

  let isBanned = "";
  let isEmailConfirmed = "";

  if (filters.status === UsersFilterStatus.BAN) {
    isBanned = "true";
  } else if (filters.status === UsersFilterStatus.WAITING) {
    isEmailConfirmed = "false";
  }

  // Нормализованный ключ кеша чтобы избежать дублирования запросов
  const normalizedKey = {
    searchQuery,
    role,
    status,
    page,
    take,
  };

  return useQuery({
    queryKey: ["admin-users", normalizedKey],
    queryFn: async () => {
      const response = await apiService.get<UsersResponse>({
        url: `/admin/users?searchQuery=${searchQuery}&role=${role}&isBanned=${isBanned}&isEmailConfirmed=${isEmailConfirmed}&status=${status}&page=${page}&take=${take}`,
      });
      return response.data;
    },
  });
}

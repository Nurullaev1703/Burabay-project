import { useInfiniteQuery } from "@tanstack/react-query";
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
  name?: string;
  role?: RoleType;
  status?: UsersFilterStatus;
  skip?: number;
  take?: number;
}

export function useGetUsers(filters: UsersFilter) {
  const name = filters.name ?? "";
  const role = filters.role ?? "";
  const status = filters.status ?? "";
  // const skip = filters.skip ?? 2;
  const take = filters.take ?? 16;

  let isBanned = "";
  let isEmailConfirmed = "";

  if (filters.status === UsersFilterStatus.BAN) {
    isBanned = "true";
  } else if (filters.status === UsersFilterStatus.WAITING) {
    isEmailConfirmed = "false";
  }

  return useInfiniteQuery({
    queryKey: ["admin-users", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get<Profile[]>({
        url: `/admin/users?name=${name}&role=${role}&isBanned=${isBanned}&isEmailConfirmed=${isEmailConfirmed}&status=${status}&skip=${pageParam}&take=${take}`,
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === take ? allPages.length * take : undefined;
    },
  });
}

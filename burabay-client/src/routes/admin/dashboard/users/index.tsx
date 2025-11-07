import { createFileRoute } from "@tanstack/react-router";
import UsersPage from "../../../../pages/admin/dashboard/UsersPage";
import { UsersFilter } from "../../../../pages/admin/dashboard/model/user-filter";
import { useGetProfileUser } from "../../../../pages/notifications/notificationOrg/notificaions-utils";
import { Loader } from "../../../../components/Loader";

export const Route = createFileRoute("/admin/dashboard/users/")({
  component: UsersPageRoute,
  validateSearch: (search: Record<string, unknown>): UsersFilter => ({
    searchQuery: (search.searchQuery as string) || undefined,
    role: search.role as any,
    status: search.status as any,
    page: search.page ? Number(search.page) : undefined,
    take: search.take ? Number(search.take) : undefined,
  }),
});

function UsersPageRoute() {
  const filters = Route.useSearch();
  const { data, isLoading } = useGetProfileUser();
  if (isLoading) {
    return <Loader />;
  }
  if (data) {
    return <UsersPage filters={filters} profile={data} />;
  }
}

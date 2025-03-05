import { createFileRoute } from '@tanstack/react-router'
import UsersPage from '../../../../pages/admin/dashboard/UsersPage'
import { UsersFilter } from '../../../../pages/admin/dashboard/model/user-filter'
import { useGetProfileUser } from '../../../../pages/notifications/notificationOrg/notificaions-utils';
import { Loader } from '../../../../components/Loader';

export const Route = createFileRoute('/admin/dashboard/users/')({
  component: UsersPageRoute,
  validateSearch: () => ({}) as UsersFilter,
  })

function UsersPageRoute() {
  const filters = Route.useSearch();
  const { data, isLoading } = useGetProfileUser();
  if(isLoading){
    <Loader/>
  }
  if(data){
    return <UsersPage filters={filters} profile={data} />;
  }
}
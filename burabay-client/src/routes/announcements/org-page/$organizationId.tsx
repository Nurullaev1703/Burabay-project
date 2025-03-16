import { createFileRoute } from '@tanstack/react-router'
import { UseGetOrg } from '../../../pages/announcements/announcement/announcement-util';
import { Loader } from '../../../components/Loader';
import { OrgPage } from '../../../pages/announcements/announcement/org-page/OrgPage';

export const Route = createFileRoute('/announcements/org-page/$organizationId')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  const {organizationId} = Route.useParams();
  const {data, isLoading} = UseGetOrg(organizationId);
  if (isLoading) {
    return <Loader />
  }
  if (data) {
    return <OrgPage org={data} />
  }
}

import { createFileRoute, useParams } from '@tanstack/react-router'
import { StepSix } from '../../../pages/announcements/step-six/StepSix'
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util';
import { Loader } from '../../../components/Loader';

export const Route = createFileRoute(
  '/announcements/addAnnouncements/step-six/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: Route.id });
  const { data, isLoading } = UseGetAnnouncement(id);
    if (isLoading) {
      return <Loader />;
    }
  
    if (data) {
      return <StepSix announcement={data} id={id} />;
    }
}

import { createFileRoute, useParams } from "@tanstack/react-router";
import { StepFive } from "../../../pages/announcements/step-five/StepFive";
import { UseGetAnnouncement } from '../../../pages/announcements/announcement/announcement-util';
import { Loader } from '../../../components/Loader';

export const Route = createFileRoute(
  "/announcements/addAnnouncements/step-five/$id"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: Route.id });
  const { data, isLoading } = UseGetAnnouncement(id);

  if (isLoading) {
    return <Loader />;
  }

  if (data) {
    return <StepFive announcement={data} id={id} />;
  }
}

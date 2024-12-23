import { createFileRoute, useParams } from "@tanstack/react-router";
import { StepFive } from "../../../pages/announcements/step-five/StepFive";

export const Route = createFileRoute(
  "/announcements/addAnnouncements/step-five/$id"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: Route.id });
  return <StepFive id={id} />;
}

import { createFileRoute } from "@tanstack/react-router";
import { StepSix } from "../../../pages/announcements/step-six/StepSix";

export const Route = createFileRoute(
  "/announcements/addAnnouncements/step-six"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <StepSix />;
}

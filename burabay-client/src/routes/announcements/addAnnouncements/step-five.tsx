import { createFileRoute } from "@tanstack/react-router";
import { StepFive } from "../../../pages/announcements/step-five/StepFive";

export const Route = createFileRoute(
  "/announcements/addAnnouncements/step-five"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <StepFive />;
}

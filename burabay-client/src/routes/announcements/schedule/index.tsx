import { createFileRoute } from "@tanstack/react-router";
import { Schedule } from "../../../pages/announcements/announcement/schedule/Schedule";

export const Route = createFileRoute("/announcements/schedule/")({
  component: RouteComponent,
});

function RouteComponent() {
    return <Schedule />;
}

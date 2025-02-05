import { createFileRoute } from "@tanstack/react-router";
import { AddReview } from "../../../pages/announcements/reviews/add/AddReview";

export const Route = createFileRoute("/announcements/reviews/add-review")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddReview />;
}

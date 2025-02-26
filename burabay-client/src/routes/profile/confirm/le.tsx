import { createFileRoute } from "@tanstack/react-router";
import { LEForm } from "../../../pages/profile/confirm/LEForm";

export const Route = createFileRoute("/profile/confirm/le")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LEForm />;
}

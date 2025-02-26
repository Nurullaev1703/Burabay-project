import { createFileRoute } from "@tanstack/react-router";
import { ConfirmPage } from "../../../pages/profile/confirm/ConfirmPage";

export const Route = createFileRoute("/profile/confirm/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ConfirmPage />;
}

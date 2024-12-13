import { createFileRoute } from "@tanstack/react-router";
import { CheckPasswordPage } from "../../../pages/register/CheckPassword";

export const Route = createFileRoute("/register/password/check/$email")({
  component: CheckPasswordPageRoute,
});

function CheckPasswordPageRoute() {
  const { email } = Route.useParams();

  return <CheckPasswordPage email={email} />;
}

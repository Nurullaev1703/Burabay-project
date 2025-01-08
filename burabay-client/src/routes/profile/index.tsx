import { createFileRoute } from "@tanstack/react-router";
import { Profile } from "../../pages/profile/Profile";

export const Route = createFileRoute("/profile/")({
  component: ProfileRoute,
});

function ProfileRoute() {
    return <Profile />;
}

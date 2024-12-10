import { createFileRoute } from "@tanstack/react-router";
import { EditProfile } from "../../../pages/profile/edit/EditProfile";
import { EditProfileUser } from "../../../pages/profile/edit/EditProfileUser";
import { user } from "../../../pages/profile/Profile";

export const Route = createFileRoute("/profile/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  if (user?.role === "организация") {
    return <EditProfile />;
  } else {
    return <EditProfileUser />;
  }
}

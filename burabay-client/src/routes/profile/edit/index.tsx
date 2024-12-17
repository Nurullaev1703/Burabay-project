import { createFileRoute } from "@tanstack/react-router";
import { EditProfile } from "../../../pages/profile/edit/EditProfile";
import { EditProfileUser } from "../../../pages/profile/edit/EditProfileUser";
import { useAuth } from "../../../features/auth";

export const Route = createFileRoute("/profile/edit/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {user} = useAuth();
  if (user?.role === "бизнес") {
    return <EditProfile />;
  } else {
    return <EditProfileUser />;
  }
}

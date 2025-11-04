import { createFileRoute, redirect } from "@tanstack/react-router";
import { roleService } from "../services/storage/Factory";
import { ROLE_TYPE } from "../pages/auth/model/auth-model";

export const Route = createFileRoute("/")({
  beforeLoad: RouteInit,
});

function RouteInit() {
  // Проверяем, есть ли роль в хранилище
  if (!roleService.hasValue()) {
    throw redirect({ to: "/welcome" });
  }

  switch (roleService.getValue()) {
    case ROLE_TYPE.ADMIN:
      throw redirect({ to: "/admin/auth" });
    case ROLE_TYPE.BUSINESS:
      throw redirect({ to: "/announcements" });
    case ROLE_TYPE.TOURIST:
      throw redirect({ to: "/main" });
    default:
      throw redirect({ to: "/welcome" });
  }
}

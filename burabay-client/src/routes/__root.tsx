import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { RootRouteContext } from "../types/tanstack";
import { useAuth } from "../features/auth";
import { InitPage } from "../pages/init/InitPage";
import { notificationService, tokenService } from "../services/storage/Factory";
import { NotificationModal } from "../pages/notifications/notificationOrg/push";
import { NotFound } from "../pages/not-found/NotFound";

export const AUTH_PATH = [
  "/auth",
  "/register",
  "/help",
  "/welcome",
  "/HelpPage",
];

export const Route = createRootRouteWithContext<RootRouteContext>()({
  notFoundComponent: () => <NotFound />,
  component: () => {
    const { token, isAuthenticated } = useAuth();

    // при отсутствии авторизации идет попытка получения профиля
    if (token && !isAuthenticated) {
      return <InitPage />;
    }
    return (
      <>
        <div className="overflow-y-auto container mx-auto relative max-w-fullWidth overflow-x-hidden">
          <Outlet />
          {!notificationService.hasValue() && token && <NotificationModal />}
        </div>
      </>
    );
  },
  beforeLoad: (options) => {
    const isAuthPath = AUTH_PATH.some((path) =>
      options.location.pathname.startsWith(path)
    );
    if (!isAuthPath && !tokenService.hasValue()) {
      throw redirect({ to: "/welcome" });
    }
  },
});

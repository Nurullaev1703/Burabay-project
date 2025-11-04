import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import device from "current-device";
import { RootRouteContext } from "../types/tanstack";
import { useAuth } from "../features/auth";
import { InitPage } from "../pages/init/InitPage";
import {
  notificationService,
  roleService,
  tokenService,
} from "../services/storage/Factory";
import { NotificationModal } from "../pages/notifications/notificationOrg/push";
import { NotFound } from "../pages/not-found/NotFound";
import { ROLE_TYPE } from "../pages/auth/model/auth-model";

export const AUTH_PATH = [
  "/auth",
  "/register",
  "/help",
  "/welcome",
  "/HelpPage",
  "/admin/auth",
];

export const Route = createRootRouteWithContext<RootRouteContext>()({
  // notFoundComponent: () => <NotFound />,
  component: () => {
    const { token, isAuthenticated } = useAuth();

    // при отсутствии авторизации идет попытка получения профиля
    if (token && !isAuthenticated) {
      return <InitPage />;
    }

    // Проверяем роль пользователя
    const userRole = roleService.hasValue() ? roleService.getValue() : null;
    const isAdmin = userRole === ROLE_TYPE.ADMIN;

    // Разрешаем доступ к announcements для админов на десктопе
    const isAnnouncementPath = location.pathname.includes("/announcements");

    // Блокируем доступ к административным путям со смартфонов и планшетов
    const isAdminPath = location.pathname.includes("/admin");
    if (isAdminPath && device.type !== "desktop") {
      return <NotFound />;
    }

    // запрещаем переходы на Десктоп кроме админа и путей announcements для админа
    if (
      device.type == "desktop" &&
      !location.pathname.includes("/admin") &&
      !(isAdmin && isAnnouncementPath)
    ) {
      return <NotFound />;
    }
    return (
      <>
        <div
          className={`overflow-y-auto mx-auto ${device.type == "desktop" ? "" : "container max-w-fullWidth"} relative overflow-x-hidden`}
        >
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

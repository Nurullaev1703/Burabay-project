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
import { useEffect } from "react";

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

    // Блокируем только выделение текста, не трогая остальные события
    useEffect(() => {
      const preventSelection = (e: Event) => {
        const target = e.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        
        // Разрешаем выделение только в input, textarea и contenteditable
        if (
          tagName !== 'input' && 
          tagName !== 'textarea' && 
          target.contentEditable !== 'true'
        ) {
          e.preventDefault();
          return false;
        }
      };

      // Добавляем только обработчик selectstart для блокировки выделения
      document.addEventListener('selectstart', preventSelection);

      return () => {
        document.removeEventListener('selectstart', preventSelection);
      };
    }, []);

    // при отсутствии авторизации идет попытка получения профиля
    if (token && !isAuthenticated) {
      return <InitPage />;
    }

    // Проверяем роль пользователя
    let userRole: string | null = null;
    try {
      if (roleService.hasValue()) {
        userRole = roleService.getValue();
      }
    } catch (e) {
      // Если значение в storage повреждено — удаляем токен/роль и редиректим на авторизацию
      try {
        tokenService.deleteValue();
      } catch (err) {}
      try {
        roleService.deleteValue();
      } catch (err) {}
      // Обходим рендер и сразу отправляем на страницу авторизации
      window.location.assign("/auth");
      return null;
    }

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
          className={`ios-scrollable-content overflow-y-auto mx-auto ${device.type == "desktop" ? "" : "container max-w-fullWidth"} relative overflow-x-hidden`}
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

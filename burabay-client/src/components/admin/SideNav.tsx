import React, { useState } from "react";
import logo from "../../app/icons/admin/logo.svg";
import info from "../../app/icons/admin/complaints.svg";
import users from "../../app/icons/admin/users.svg";
import messages from "../../app/icons/admin/messages.svg";
import analytics from "../../app/icons/admin/analytics.svg";
import logout from "../../app/icons/admin/logout.svg";
import banners from "../../app/icons/admin/banners.svg";
import { Link, useNavigate, useMatchRoute } from "@tanstack/react-router";

interface SideNavProps {
  className?: string;
}

const SideNav: React.FC<SideNavProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const [isModalOpen, setIsModalOpen] = useState(false); // Добавляем состояние для модального окна

  const links = [
    {
      icon: info,
      label: "Жалобы",
      to: "/admin/dashboard/complaints",
      hasNotifications: true,
    },
    {
      icon: users,
      label: "Пользователи",
      to: "/admin/dashboard/users",
      hasNotifications: true,
    },
    {
      icon: messages,
      label: "Сообщения",
      to: "/admin/dashboard/messages",
      hasNotifications: true,
    },
    {
      icon: analytics,
      label: "Аналитика",
      to: "/admin/dashboard/analytics",
      hasNotifications: true,
    },
    {
      icon: banners,
      label: "Баннер",
      to: "/admin/dashboard/banners",
      hasNotifications: true,
    },
  ];
  const logoutIcon = logout;

  const handleLogout = () => {
    setIsModalOpen(true); // Открываем модальное окно
  };

  const confirmLogout = () => {
    navigate({ to: "/main" }); // Выполняем выход
    setIsModalOpen(false); // Закрываем модальное окно
  };

  const cancelLogout = () => {
    setIsModalOpen(false); // Закрываем модальное окно
  };

  return (
    <div
      className={`side-nav ${className} overflow-hidden fixed top-0 left-0 h-full bg-[#0A7D9E]  px-4 py-8
      transition-all duration-300 ease-linear
      ${isExpanded ? "w-[312px]" : "w-[94px] "} 
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Логотип */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" />
        {isExpanded && (
          <span className="text-white text-lg font-semibold">
            Администратор
          </span>
        )}
      </div>

      {/* Навигационные ссылки */}
      <nav className="flex flex-col gap-4 mt-8">
        {links.map((link, index) => {
          const isActive = matchRoute({ to: link.to, fuzzy: true });

          return (
            <Link
              key={index}
              to={link.to}
              className={`flex items-center py-[12px] px-[16px] cursor-pointer rounded-[8px] transition-all duration-300 ease-linear
                ${isActive ? "bg-white text-[#0A7D9E]" : "text-white border-transparent hover:border-white border-[1.05px]"}
              `}
            >
              <div className="relative">
                <img
                  src={link.icon}
                  alt={link.label}
                  className={`w-[30px] h-[30px] transition-all duration-300
                    ${isActive ? "" : "brightness-[25]"}
                  `}
                />
                {link.hasNotifications && (
                  <span className="absolute top-0 right-0 w-[6px] h-[6px] bg-red-500 rounded-full"></span>
                )}
              </div>
              {isExpanded && (
                <span className="text-md font-medium ml-2">{link.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Кнопка выхода */}
      <div className="absolute bottom-4 w-full">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-[12px] text-white border border-transparent hover:border-white rounded-[8px] w-[280px] cursor-pointer"
        >
          <img
            src={logoutIcon}
            alt="Выйти"
            className="w-[30px] h-[30px] brightness-[25]"
          />
          {isExpanded && <span className="text-md font-medium">Выйти</span>}
        </button>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-[390px] p-6 rounded-md">
            <p className="text-[18px] text-center font-medium mb-4">Вы уверены, что хотите выйти из аккаунта?</p>
            <div className="gap-4 space-y-4">
              <button
                onClick={confirmLogout}
                className="border-[3px] border-[#FF4545] text-[#FF4545] font-medium px-4 py-2 rounded-[32px] h-[54px] w-full"
              >
                Да
              </button>
              <button
                onClick={cancelLogout}
                className="border bg-[#0A7D9E] font-medium rounded-[32px] text-white px-4 py-2 h-[54px] w-full"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav;

import React, { useState } from "react";
import logo from "../../app/icons/admin/logo.svg";
import info from "../../app/icons/admin/complaints.svg";
import users from "../../app/icons/admin/users.svg";
import messages from "../../app/icons/admin/messages.svg";
import analytics from "../../app/icons/admin/analytics.svg";
import logout from "../../app/icons/admin/logout.svg";
import { Link, useNavigate, useMatchRoute } from "@tanstack/react-router";

interface SideNavProps {
  className?: string;
}

const SideNav: React.FC<SideNavProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const links = [
    { icon: info, label: "Жалобы", to: "/admin/dashboard/complaints" },
    { icon: users, label: "Пользователи", to: "/admin/dashboard/users" },
    { icon: messages, label: "Сообщения", to: "/admin/dashboard/messages" },
    { icon: analytics, label: "Аналитика", to: "/admin/dashboard/analytics" },
  ];
  const logoutIcon = logout;

  const handleLogout = () => {
    navigate({ to: "/admin/auth" });
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
              <img
                src={link.icon}
                alt={link.label}
                className={`w-[30px] h-[30px] transition-all duration-300
                  ${isActive ? "" : "brightness-[25]"}
                `}
              />
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
          className="flex items-center gap-4 px-4 py-[12px] text-white border border-transparent hover:border-white rounded-[8px] cursor-pointer w-full"
        >
          <img
            src={logoutIcon}
            alt="Выйти"
            className="w-[30px] h-[30px] brightness-[25]"
          />
          {isExpanded && <span className="text-md font-medium">Выйти</span>}
        </button>
      </div>
    </div>
  );
};

export default SideNav;

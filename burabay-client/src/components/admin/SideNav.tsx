import React, { useState } from "react";
import logo from "../../../public/icons/logo.png";
import info from "../../../public/icons/complaints.svg";
import users from "../../../public/icons/users.svg";
import messages from "../../../public/icons/messages.svg";
import analytics from "../../../public/icons/analytics.png";
import logout from "../../../public/icons/logout.png";
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
      className={`side-nav ${className} fixed top-0 left-0 h-full bg-[#0A7D9E] 
        ${isExpanded ? "w-[312px] px-4 py-[33px]" : "w-[94px] px-4 py-[33px]"} 
        transition-all duration-300 ease-linear
      `}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Логотип */}
      <div className="flex items-center gap-2 justify-center">
        <div className="flex justify-center items-center w-[62px] h-[29px]">
          <img src={logo} alt="Logo" />
        </div>
        {isExpanded && <span className="text-white text-lg font-semibold">Администратор</span>}
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
                  ${isActive ? "filter invert brightness-0" : ""}
                `}
              />
              {isExpanded && <span className="text-md font-medium ml-2">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Кнопка выхода */}
      <div className="absolute bottom-4 w-full">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-[12px] text-white hover:border-white border-[1.05px] border-transparent hover:border-white rounded-[8px] cursor-pointer w-full"
        >
          <img src={logoutIcon} alt="Выйти" className="w-[30px] h-[30px]" />
          {isExpanded && <span className="text-md font-medium">Выйти</span>}
        </button>
      </div>
    </div>
  );
};

export default SideNav;

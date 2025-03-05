import { useRef, useEffect, useState } from "react";
import SideNav from "../../../components/admin/SideNav";
import authBg from "../../../app/icons/bg_auth.png";
import { baseUrl } from "../../../services/api/ServerData";
import { RoleType, useGetUsers, UsersFilter, UsersFilterStatus } from "./model/user-filter";
import { useNavigate } from "@tanstack/react-router";
import { Organization, Profile } from "../../profile/model/profile";
import { Typography } from "../../../shared/ui/Typography";
import { ROLE_TYPE } from "../../auth/model/auth-model";


interface Props {
  filters: UsersFilter;
  profile: Profile
}

export default function UsersList({ filters}: Props) {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useGetUsers(filters);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  const roleFilterRef = useRef<HTMLDivElement | null>(null);
  const statusFilterRef = useRef<HTMLDivElement | null>(null);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
const [_selectedUserId, _setSelectedUserId] = useState<string | null>(null);
  const updateFilters = (newFilters: Partial<UsersFilter>) => {
    navigate({
      to: "/admin/dashboard/users",
      search: {
        ...filters,
        ...newFilters,
      },
    });
  };
  const getDocumentUrl = (path: string | null) => {
    if (!path) return null;
    return `${baseUrl}${path.replace(/^\/+/, "")}`;
  };
  
  const openConfirmModal = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsConfirmModalOpen(true);
};
const closeConfirmModal = () => {
    setSelectedOrganization(null);
    setIsConfirmModalOpen(false);
};
  
const handleConfirmUser = () => {
  if (!selectedOrganization) return;
  console.log(`Подтвердили организацию с id: ${selectedOrganization.id}`);
  closeConfirmModal();
};


  const closeDropdownsOnClickOutside = (event: MouseEvent) => {
    if (
      roleFilterRef.current &&
      !roleFilterRef.current.contains(event.target as Node)
    ) {
      setIsRoleDropdownOpen(false);
    }
    if (
      statusFilterRef.current &&
      !statusFilterRef.current.contains(event.target as Node)
    ) {
      setIsStatusDropdownOpen(false);
    }
  };
  

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdownsOnClickOutside);
    return () => {
      document.removeEventListener("mousedown", closeDropdownsOnClickOutside);
    };
  }, []);

  const BASE_URL = baseUrl;

  return (
    <div className="relative min-h-screen flex">
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>
      <div className="relative z-50">
        <SideNav />
      
      </div>
      <div className="relative z-10 flex flex-col w-full p-6 ml-[94px]">
        <div className="fixed top-0 left-[94px] right-0 bg-white shadow-md rounded-b-[16px] p-4 z-20 flex space-x-4 mx-[16px] items-center">
          <input
            type="text"
            placeholder="Поиск"
            className="p-2 border rounded-[8px] bg-[#FAF9F7] border-[#EDECEA] w-full"
            value={filters.name ?? ""}
            onChange={(e) => updateFilters({ name: e.target.value })}
          />

          <div className="relative" ref={roleFilterRef}>
            <button
              type="button"
              className="w-[264.5px] text-[#0A7D9E] font-roboto pt-[12px] pr-[32px] pb-[12px] pl-[32px] border-[1px] rounded-[8px] border-[#0A7D9E] bg-white"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            >
              {filters.role ?? "Все пользователи"}
            </button>
            {isRoleDropdownOpen && (
              <div className="absolute mt-1 w-[264.5px] bg-white rounded shadow-md z-10 border">
                <label className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="radio"
                    name="roleFilter"
                    checked={!filters.role}
                    onChange={() => updateFilters({ role: undefined })}
                    className="mr-2 h-5 w-5 accent-[#0A7D9E] cursor-pointer"
                  />
                  Все пользователи
                </label>
                {Object.values(RoleType).map((roleValue) => (
                  <label
                    key={roleValue}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="roleFilter"
                      value={roleValue}
                      checked={filters.role === roleValue}
                      onChange={() => updateFilters({ role: roleValue })}
                      className="mr-2 h-5 w-5 accent-[#0A7D9E] cursor-pointer"
                    />
                    {roleValue}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={statusFilterRef}>
            <button
              type="button"
              className="w-[264.5px] text-[#0A7D9E] pt-[12px] pr-[32px] pb-[12px] pl-[32px] border-[1px] rounded-[8px] border-[#0A7D9E] bg-white"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            >
              {filters.status ?? "Все статусы"}
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute mt-1 w-[264.5px] bg-white rounded shadow-md z-10 border">
                <label className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    checked={!filters.status}
                    onChange={() => updateFilters({ status: undefined })}
                    className="mr-2 h-5 w-5 accent-[#0A7D9E] cursor-pointer"
                  />
                  Все статусы
                </label>
                {Object.values(UsersFilterStatus).map((status) => (
                  <label
                    key={status}
                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="statusFilter"
                      value={status}
                      checked={filters.status === status}
                      onChange={() => updateFilters({ status })}
                      className="mr-2 h-5 w-5 accent-[#0A7D9E] cursor-pointer"
                    />
                    {status}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-16">
          {isLoading ? (
            <p className="text-gray-500">Загрузка...</p>
          ) : (
<div className="grid gap-4">
  {users.map((user) => (
    <div
    key={user.organization?.id || user.id}
      className="rounded-[16px] flex flex-wrap items-center bg-white md:flex-nowrap"
    >
      <div className="flex items-center h-[84px] space-x-4 pl-[32px] pt-[16px] pb-[16px] flex-1 min-w-[150px] border-r border-[#E4E9EA]">
        <img
          src={
            user.picture
              ? `${BASE_URL}${user.picture}`
              : "https://via.placeholder.com/50"
          }
          alt={user.fullName}
          className="w-[52px] h-[52px] rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-roboto">{user.fullName}</h2>
          <p
            className={`text-sm ${
              user.isBanned
                ? "text-red-500"
                : "text-[14px] text-[#39B56B]"
            }`}
          >
            {user.isBanned
              ? UsersFilterStatus.BAN
              : user.role === ROLE_TYPE.BUSINESS
                ? user.organization?.isConfirmed
                  ? "Подтвержден"
                  : UsersFilterStatus.WAITING
                : user.isEmailConfirmed
                  ? "Подтвержден"
                  : UsersFilterStatus.WAITING}
          </p>
          <span className="text-[12px] text-[#999999]">{user.role}</span>
        </div>
      </div>

      <div className="pl-[32px] flex-1">
        <p>{user.phoneNumber || "—"}</p>
        <p className="text-[#999]">Телефон</p>
      </div>

      {/* Кнопка подтверждения только для организаций (business) */}
      {user.role === ROLE_TYPE.BUSINESS && !user.organization?.isConfirmed && (
        <button
          className="ml-auto text-[#0A7D9E] underline cursor-pointer"
          onClick={() => openConfirmModal(user.organization!)}
        >
          Подтвердить
        </button>
      )}

      {user.role === ROLE_TYPE.TOURIST && !user.isEmailConfirmed && (
        <button
          className="ml-auto text-[#0A7D9E] underline cursor-pointer"
          onClick={() => openConfirmModal}
        >
          Подтвердить
        </button>
      )}

    </div>
  ))}
</div>

          )}
        </div>
      </div>
      {isConfirmModalOpen && selectedOrganization && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={`${BASE_URL}${selectedOrganization.imgUrl}`}
          alt="Organization Logo"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <Typography className="text-xl font-bold">{selectedOrganization.name}</Typography>
          <Typography className="text-green-600 text-sm">Ожидание подтверждения</Typography>
          <Typography className="text-gray-500 text-sm">Организация</Typography>
        </div>
      </div>

      <div>
        <Typography>{"Номер телефона"}</Typography>
        <Typography>{""}</Typography>
      </div>

      <div className="mb-2">
        <Typography className="text-gray-500 text-sm">БИН</Typography>
        <Typography className="font-medium">{selectedOrganization.bin}</Typography>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <img src="/icons/document.svg" alt="doc" />
          {selectedOrganization.regCouponPath ? (
          <a
  href={selectedOrganization.regCouponPath ?? "#"}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline"
>
  {selectedOrganization.regCouponPath?.split('/').pop() || "Документ"}
</a>
      ) : (
        <Typography className="text-red-500 text-sm">Документ не загружен</Typography>
      )}
        </div>
        <div className="flex items-center space-x-2">
          <img src="/icons/document.svg" alt="doc" />
          {selectedOrganization.ibanDocPath ? (
          <a
  href={selectedOrganization.ibanDocPath ?? "#"}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline"
>
  {selectedOrganization.ibanDocPath?.split('/').pop() || "Документ"}
</a>
      ) : (
        <Typography className="text-red-500 text-sm">Документ не загружен</Typography>
      )}
        </div>
        <div className="flex items-center space-x-2">
          <img src="/icons/document.svg" alt="doc" />
          {selectedOrganization.orgRulePath ? (
          <a
  href={selectedOrganization.orgRulePath ?? "#"}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline"
>
  {selectedOrganization.orgRulePath?.split('/').pop() || "Документ"}
</a>
      ) : (
        <Typography className="text-red-500 text-sm">Документ не загружен</Typography>
      )}
          <a
            href={`${BASE_URL}${selectedOrganization.orgRulePath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Устав организации
          </a>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={() => handleConfirmUser}
          className="w-full py-3 bg-green-500 text-white rounded-lg font-medium"
        >
          Подтвердить аккаунт
        </button>
        <button
          onClick={closeConfirmModal}
          className="w-full py-3 bg-red text-white rounded-lg font-medium"
        >
          Отклонить
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

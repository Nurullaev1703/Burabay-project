import { useRef, useEffect, useState } from "react";
import SideNav from "../../../components/admin/SideNav";
import authBg from "../../../app/icons/bg_auth.png";
import { baseUrl } from "../../../services/api/ServerData";
import {
  RoleType,
  useGetUsers,
  UsersFilter,
  UsersFilterStatus,
} from "./model/user-filter";
import { useNavigate } from "@tanstack/react-router";
import { Organization, Profile } from "../../profile/model/profile";
import { Typography } from "../../../shared/ui/Typography";
import { ROLE_TYPE } from "../../auth/model/auth-model";
import defaultImage from "../../../app/icons/abstract-bg.svg?url";
import { apiService } from "../../../services/api/ApiService";

interface Props {
  filters: UsersFilter;
  profile: Profile;
}

export default function UsersList({ filters }: Props) {
  const navigate = useNavigate();
  const { data: users = [], isLoading } = useGetUsers(filters);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const roleFilterRef = useRef<HTMLDivElement | null>(null);
  const statusFilterRef = useRef<HTMLDivElement | null>(null);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] =
    useState(false);
  const [_selectedUserId, _setSelectedUserId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    "confirm" | "reject" | null
  >(null);
  const [visibleUsersCount, setVisibleUsersCount] = useState(2);

  const updateFilters = (newFilters: Partial<UsersFilter>) => {
    navigate({
      to: "/admin/dashboard/users",
      search: {
        ...filters,
        ...newFilters,
      },
    });
  };

  const resolveDocUrl = (docPath: string | null) => {
    if (!docPath) return "#";
    return `${baseUrl}/public${docPath}`;
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

  const openConfirmActionModal = (action: "confirm" | "reject") => {
    setConfirmAction(action);
    setIsConfirmActionModalOpen(true);
  };

  const closeConfirmActionModal = () => {
    setConfirmAction(null);
    setIsConfirmActionModalOpen(false);
  };

  const handleConfirmUser = () => {
    openConfirmActionModal("confirm");
  };

  const handleRejectUser = () => {
    openConfirmActionModal("reject");
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

  const confirmActionHandler = async () => {
    if (!selectedOrganization) return;

    try {
      const orgId = selectedOrganization.id;
      const url =
        confirmAction === "confirm"
          ? `/admin/check-org/${orgId}`
          : `/admin/cancel-info/${orgId}`;

      const response = await apiService.patch({ url });

      if (response.status !== 200) {
        throw new Error(`Ошибка при выполнении действия: ${response.status}`);
      }

      console.log(`Успешно выполнили действие для организации с id: ${orgId}`);
    } catch (error) {
      console.error("Ошибка при выполнении действия:", error);
    }

    closeConfirmActionModal();
    closeConfirmModal();
  };

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const loadMoreUsers = () => {
    setVisibleUsersCount((prevCount) => prevCount + 20);
  };

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
      <div className="relative z-10 flex flex-col w-full p-4 mt-4 ml-[94px]">
        <div className="fixed top-0 left-[94px] right-0 border-[2px] border-[#E4E9EA] bg-white rounded-b-[16px] p-4 z-20 flex space-x-4 mx-[16px] items-center">
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
              {filters.role
                ? capitalizeFirstLetter(filters.role)
                : "Все пользователи"}
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
                {Object.values(RoleType)
                  .filter((roleValue) => roleValue !== "admin")
                  .map((roleValue) => (
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
                      {capitalizeFirstLetter(roleValue)}
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
              {filters.status
                ? capitalizeFirstLetter(filters.status)
                : "Все статусы"}
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
                    {capitalizeFirstLetter(status)}
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
              {users.slice(0, visibleUsersCount).map((user) => (
                <div
                  key={user.organization?.id || user.id}
                  className="rounded-[16px] flex flex-wrap items-center bg-white md:flex-nowrap"
                >
                  <div className="flex items-center h-[84px] space-x-4 pl-[32px] pt-[16px] pb-[16px] flex-1 min-w-[150px] border-r border-[#E4E9EA]">
                    <img
                      src={
                        user.picture
                          ? `${BASE_URL}${user.picture}`
                          : `${BASE_URL}${user.organization?.imgUrl}`
                      }
                      alt={user.fullName}
                      className="w-[52px] h-[52px] rounded-full object-cover bg-gray-200"
                      onError={(e) => (e.currentTarget.src = defaultImage)}
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
                      <span className="text-[12px] text-[#999999]">
                        {user.role}
                      </span>
                    </div>
                    {user.role === ROLE_TYPE.BUSINESS &&
                      (user.organization?.isConfirmed ? (
                        <div className="flex ">
                          <span className="ml-auto text-[#0A7D9E] mr-4">
                            Подтвержден
                          </span>
                          <img src="../../../../public/confirmed.svg"></img>
                        </div>
                      ) : (
                        <button
                          className="ml-auto text-[#0A7D9E] underline cursor-pointer"
                          onClick={() => openConfirmModal(user.organization!)}
                        >
                          Подтвердить
                        </button>
                      ))}
                  </div>

                  <div className="flex-1">
                    <div className="pl-[32px] flex-1">
                      <p>{user.phoneNumber || "—"}</p>
                      <p className="text-[#999]">Телефон</p>
                    </div>
                  </div>
                  <div className="border-l h-full border-grey pl-[32px] flex-1 flex items-center">
                    <div>
                      <p>{user.email || "—"}</p>
                      <p className="text-[#999]">email</p>
                    </div>
                  </div>

                  {user.role === ROLE_TYPE.TOURIST &&
                    !user.isEmailConfirmed && (
                      <button
                        className="ml-auto text-[#0A7D9E] underline cursor-pointer"
                        onClick={() => openConfirmModal}
                      >
                        Подтвердить
                      </button>
                    )}
                </div>
              ))}
              {visibleUsersCount < users.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={loadMoreUsers}
                    className="bg-[#0A7D9E] text-white px-4 py-2 rounded-lg"
                  >
                    Загрузить еще
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isConfirmModalOpen && selectedOrganization && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white h-[636px] p-4 rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="space-y-[8px]">
              <div className="flex items-center space-y-2 space-x-4 mb-4">
                <img
                  src={`${BASE_URL}${selectedOrganization.imgUrl}`}
                  alt="Organization Logo"
                  className="w-[52px] h-[52px] rounded-full object-cover"
                />
                <div>
                  <Typography className="">
                    {selectedOrganization.name}
                  </Typography>
                  <p className="text-[#39B56B] text-[14px]">
                    Ожидание подтверждения
                  </p>
                  <p className="text-[#999999] text-[12px]">Организация</p>
                </div>
                <button
                  className="h-[44px] w-[44px]"
                  onClick={closeConfirmModal}
                >
                  <img
                    src="../../../../public/Close.png"
                    alt="Назад"
                    className="w-full h-full"
                  />
                </button>
              </div>

              <div className="pt-3 pr-3 pb-[14px] pl-[12px]">
                <p className="text-[#999999] text-sm">БИН</p>
                <Typography className="font-medium">
                  {selectedOrganization.bin}
                </Typography>
              </div>

              <div className="pt-3 pr-3 pb-[14px] pl-[12px]">
                <p className="text-[#999999] ">{"Номер телефона"}</p>
                <Typography>{"Не указан"}</Typography>
              </div>

              <div className="pt-3 pr-3 pb-[14px] pl-[12px] space-y-3">
                <div className="flex items-center space-x-2">
                  <img src="../../../../public/document.svg" alt="doc" />
                  <div>
                    <p className="text-[12px] text-[#999999] w-full">
                      Талон о гос.регистрации ИП
                    </p>
                    {selectedOrganization.regCouponPath ? (
                      <a
                        href={selectedOrganization.regCouponPath ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black"
                      >
                        {selectedOrganization.regCouponPath?.split("/").pop() ||
                          "Документ"}
                      </a>
                    ) : (
                      <Typography className="text-red-500 text-sm">
                        Документ не загружен
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img src="../../../../public/document.svg" alt="doc" />
                  <div className="">
                    <p className="text-[12px] text-[#999999]">Справка IBAN</p>
                    {selectedOrganization.ibanDocPath ? (
                      <a
                        href={selectedOrganization.ibanDocPath ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black"
                      >
                        {selectedOrganization.ibanDocPath?.split("/").pop() ||
                          "Документ"}
                      </a>
                    ) : (
                      <Typography className="text-red-500 text-sm">
                        Документ не загружен
                      </Typography>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img src="../../../../public/document.svg" alt="doc" />
                  <div>
                    <p className="text-[12px] text-[#999999]">
                      Устав организации
                    </p>
                    {selectedOrganization.orgRulePath ? (
                      <a
                        href={selectedOrganization.orgRulePath ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {selectedOrganization.orgRulePath?.split("/").pop() ||
                          "Документ"}
                      </a>
                    ) : (
                      <Typography className="text-red-500 text-sm">
                        Документ не загружен
                      </Typography>
                    )}
                  </div>
                  <a
                    href={resolveDocUrl(selectedOrganization.orgRulePath)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  ></a>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={handleConfirmUser}
                className="w-full pt-[18px] pr-[12px] pb-[18px] pl-[12px] bg-[#39B56B] text-white rounded-[32px] font-medium"
              >
                Подтвердить аккаунт
              </button>
              <button
                onClick={handleRejectUser}
                className="w-full pt-[18px] pr-[12px] pb-[18px] pl-[12px] bg-[#FF5959] text-white rounded-[32px] font-medium"
              >
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
      {isConfirmActionModalOpen && confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white rounded-[16px] w-[390px] min-w-[390px] max-w-[744px] p-4 flex flex-col gap-2"
            style={{ height: "200px" }}
          >
            <Typography className="mb-4 text-[18px] text-center text-bold">
              {confirmAction === "confirm"
                ? "Подтвердить аккаунт?"
                : "Отклонить аккаунт?"}
            </Typography>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmActionHandler}
                className={`pt-[18px] pr-[12px] pb-[18px] pl-[12px] rounded-[32px] border w-[358px] h-[54px] ${
                  confirmAction === "confirm"
                    ? "bg-[#39B56B] text-white"
                    : "bg-[#FF5959] text-white"
                }`}
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "20px",
                  letterSpacing: "0.4px",
                  textAlign: "center",
                }}
              >
                {confirmAction === "confirm" ? "Подтвердить" : "Отклонить"}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={closeConfirmActionModal}
                className="pt-[18px] pr-[12px] pb-[18px] pl-[12px] rounded-[32px] border w-[358px] h-[54px] bg-[#0A7D9E] text-white"
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 500,
                  fontSize: "18px",
                  lineHeight: "20px",
                  letterSpacing: "0.4px",
                  textAlign: "center",
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

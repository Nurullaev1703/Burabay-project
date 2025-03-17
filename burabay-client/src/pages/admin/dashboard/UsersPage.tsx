import { useRef, useState } from "react";
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
import { Loader } from "../../../components/Loader";
import downloadIcon from "../../../app/icons/download.svg";

import document from "../../../../public/document.svg";
import confirmed from "../../../../public/confirmed.svg";
import Close from "../../../../public/Close.png";
import Down from "../../../../public/down-arrow.svg";

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

  const BASE_URL = baseUrl;

  const confirmActionHandler = async () => {
    if (!selectedOrganization) return;

    try {
      const orgId = selectedOrganization.id;
      const url =
        confirmAction === "confirm"
          ? `/admin/check-org/${orgId}`
          : `/admin/cancel-org/${orgId}`;

      const response = await apiService.patch({ url });

      if (response.status !== 200) {
        throw new Error(`Ошибка при выполнении действия: ${response.status}`);
      }

      console.log(`Успешно выполнили действие для организации с id: ${orgId}`);

      const notificationResponse = await apiService.post({
        url: "/notification/user",
        dto: {
          email: users.find((user) => user.organization?.id === orgId)?.email,
          title:
            confirmAction === "confirm"
              ? "Профиль подтвержден"
              : "Подтверждение отклонено",
          type: confirmAction === "confirm" ? "позитивное" : "негативное",
          message:
            confirmAction === "confirm"
              ? "Отправленные вами документы для подтверждения профиля приняты аодминистратором"
              : "Отправленные вами документы для подтверждения профиля отклонены администратором",
        },
      });

      if (notificationResponse.status !== 200) {
        throw new Error(
          `Ошибка при отправке уведомления: ${notificationResponse.status}`
        );
      }
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
        className="fixed inset-0 bg-cover bg-center opacity-25"
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
            className="p-2 border rounded-[8px] bg-[#FAF9F7] border-[#EDECEA] h-[52px] w-full"
            value={filters.name ?? ""}
            onChange={(e) => updateFilters({ name: e.target.value })}
          />

          <div className="relative" ref={roleFilterRef}>
            <button
              type="button"
              className="w-[264.5px] flex items-center justify-center text-[#0A7D9E] font-roboto pt-[12px] pr-[32px] pb-[12px] pl-[32px] border-[1px] rounded-[8px] border-[#0A7D9E] bg-white"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            >
              {filters.role
                ? capitalizeFirstLetter(filters.role)
                : "Все пользователи"}
              <img src={Down} alt="" className="ml-[17px] w-[16px] h-[16px]" />
            </button>
            {isRoleDropdownOpen && (
              <div className="absolute mt-1 w-[264.5px] bg-white rounded shadow-md z-10 border">
                <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
              className="w-[264.5px] flex items-center justify-center text-[#0A7D9E] pt-[12px] pr-[32px] pb-[12px] pl-[32px] border-[1px] rounded-[8px] border-[#0A7D9E] bg-white"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            >
              {filters.status
                ? capitalizeFirstLetter(filters.status)
                : "Все статусы"}
              <img src={Down} alt="" className="ml-[17px] w-[16px] h-[16px]" />
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute mt-1 w-[264.5px] bg-white rounded shadow-md z-10 border">
                <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
            <Loader />
          ) : (
            <div className="grid gap-4">
              {users.slice(0, visibleUsersCount).map((user) => (
                <div
                  key={user.organization?.id || user.id}
                  className="rounded-[16px] flex flex-wrap items-center bg-white md:flex-nowrap"
                >
                  <div className="flex justify-between items-center h-[84px] pl-[32px] pt-[16px] pb-[16px] flex-1 min-w-[150px]">
                    <div className="flex items-center space-x-4">
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

                      <div className="h-[58px] flex flex-col justify-center">
                        {/* Имя пользователя */}
                        {user.fullName ? (
                          <h2 className="text-[16px] font-roboto">
                            {user.fullName}
                          </h2>
                        ) : (
                          <div>
                            <p>—</p>
                          </div>
                        )}

                        {user.role === "турист" && (
                          <p
                            className={`text-sm ${
                              user.isBanned
                                ? "text-red"
                                : "text-[14px] text-[#39B56B]"
                            }`}
                          >
                            {user.isBanned
                              ? UsersFilterStatus.BAN
                              : user.isEmailConfirmed
                                ? "Подтвержден"
                                : UsersFilterStatus.WAITING}
                          </p>
                        )}

                        {/* Роль пользователя */}
                        <span className="text-[12px] text-[#999999]">
                          {user.role === "бизнес"
                            ? "Организация"
                            : user.role === "турист"
                              ? "Турист"
                              : user.role}
                        </span>
                      </div>
                    </div>
                    {user.role === ROLE_TYPE.BUSINESS &&
                      (user.organization?.isConfirmed ? (
                        <div className="flex items-center mr-8">
                          <span className="text-[#0A7D9E] mr-4">
                            Подтвержден
                          </span>
                          <img src={confirmed} alt="confirmed" />
                        </div>
                      ) : (
                        <button
                          className="text-[#39B56B] items-center pt-3 pr-4 pb-3 pl-4 gap-4 flex border-[1px] border-[#39B56B] h-[48px] w-[186px] rounded-[16px] mr-[38.5px]"
                          onClick={() => openConfirmModal(user.organization!)}
                        >
                          Подтверждение
                          <img
                            src="../../../../public/arrow.svg"
                            alt=""
                            className="h-[14px] w-2"
                          ></img>
                        </button>
                      ))}
                  </div>

                  <div className="border-l-[2px] h-full border-[#E4E9EA] flex-1 flex items-center">
                    <div className="pl-[32px] flex-1">
                      <p>{user.phoneNumber || "—"}</p>
                      <p className="text-[12px] text-[#999999]">
                        Номер телефона для связи
                      </p>
                    </div>
                  </div>

                  <div className="border-l-[2px] h-full border-[#E4E9EA] pl-[32px] flex-1 flex items-center">
                    <div>
                      <p>{user.email || "—"}</p>
                      <p className="text-[12px] text-[#999999]">
                        Email адрес для связи
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {visibleUsersCount < users.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={loadMoreUsers}
                    className="bg-[#0A7D9E] w-[400px] h-[54px] text-white text-[16px] rounded-[32px] px-4 py-2"
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
          <div className="bg-white h-[636px] p-4 rounded-lg shadow-lg w-[470px]">
            <div className="space-y-[8px]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={`${BASE_URL}${selectedOrganization.imgUrl}`}
                    alt="Лого"
                    className="w-[52px] h-[52px] rounded-full object-cover bg-gray-200"
                    onError={(e) => (e.currentTarget.src = defaultImage)}
                  />
                  <div>
                    <Typography className="">
                      {selectedOrganization?.name
                        ? selectedOrganization.name
                        : "-"}
                    </Typography>
                    <p className="text-[#39B56B] text-[14px]">
                      Ожидание подтверждения
                    </p>
                    <p className="text-[#999999] text-[12px]">Организация</p>
                  </div>
                </div>
                <button
                  className="h-[44px] w-[44px]"
                  onClick={closeConfirmModal}
                >
                  <img src={Close} alt="Назад" className="w-full h-full" />
                </button>
              </div>

              <div className="pt-3 pr-3 pb-[14px] pl-[12px]">
                <p className="text-[#999999] text-[12px] flex">БИН</p>
                <Typography className="font-medium">
                  {selectedOrganization.bin ? "—" : "Не указан"}
                </Typography>
              </div>

              <div className="pt-3 pr-3 pb-[14px] pl-[12px]">
                <p className="text-[#999999] text-[12px] flex">
                  {"Номер телефона"}
                </p>
                <Typography>Не указан</Typography>
              </div>

              <div className="pt-3 pr-3 pb-[14px] pl-[12px] space-y-[32px]">
                <div className="flex items-center space-x-2">
                  <img src={document} alt="doc" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] text-[#999999] w-full">
                        Талон о гос.регистрации ИП
                      </p>
                      {selectedOrganization.regCouponPath ? (
                        <a
                          href={`${BASE_URL}/public/docs/${selectedOrganization.id}/${selectedOrganization.regCouponPath.split("/").pop()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black"
                          download={`regFile.${selectedOrganization.regCouponPath.split(".").pop()}`}
                        >
                          <span>
                            {selectedOrganization.regCouponPath
                              .split("/")
                              .pop() || "Документ"}
                          </span>
                        </a>
                      ) : (
                        <Typography className="text-red-500 text-sm">
                          Документ не загружен
                        </Typography>
                      )}
                    </div>
                    <img src={downloadIcon} alt="" className="ml-2" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img src={document} alt="doc" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] text-[#999999]">Справка IBAN</p>
                      {selectedOrganization.ibanDocPath ? (
                        <a
                          href={`${BASE_URL}/public/docs/${selectedOrganization.id}/${selectedOrganization.ibanDocPath.split("/").pop()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black"
                          download={`ibanFile.${selectedOrganization.ibanDocPath.split(".").pop()}`}
                        >
                          <span>
                            {selectedOrganization.ibanDocPath
                              .split("/")
                              .pop() || "Документ"}
                          </span>
                        </a>
                      ) : (
                        <Typography className="text-red-500 text-sm">
                          Документ не загружен
                        </Typography>
                      )}
                    </div>
                    <img src={downloadIcon} alt="" className="ml-2" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img src={document} alt="doc" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] text-[#999999]">
                        Устав организации
                      </p>
                      {selectedOrganization.orgRulePath ? (
                        <a
                          href={`${BASE_URL}/public/docs/${selectedOrganization.id}/${selectedOrganization.orgRulePath.split("/").pop()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                          download="ruleFile"
                        >
                          <span>
                            {selectedOrganization.orgRulePath
                              .split("/")
                              .pop() || "Документ"}
                          </span>
                        </a>
                      ) : (
                        <Typography className="text-red-500 text-sm">
                          Документ не загружен
                        </Typography>
                      )}
                    </div>
                    <img src={downloadIcon} alt="" className="ml-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center space-y-4">
              <button
                onClick={handleConfirmUser}
                className="w-[400px] pt-[18px] pr-[12px] pb-[18px] pl-[12px] bg-[#39B56B] text-white rounded-[32px] font-medium"
              >
                Подтвердить аккаунт
              </button>
              <button
                onClick={handleRejectUser}
                className="w-[400px] pt-[18px] pr-[12px] pb-[18px] pl-[12px] bg-[#FF5959] text-white rounded-[32px] font-medium"
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

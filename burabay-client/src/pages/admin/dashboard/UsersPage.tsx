import { useRef, useState, useEffect, useCallback } from "react";
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
import Back from "../../../../public/Back.svg";
import arrow from "../../../../public/arrow.svg";
import { AdCard } from "../../main/ui/AdCard";
import { Announcement } from "../../announcements/model/announcements";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  filters: UsersFilter;
  profile: Profile;
}

export default function UsersList({ filters }: Props) {
  const navigate = useNavigate();
  // const [users, setUsers] = useState<Profile[]>([]);
  // const [skip, setSkip] = useState(0);
  // const take = 10;

  useEffect(() => {}, [filters.name, filters.role, filters.status]);

  // Получаем пользователей с учетом skip/take
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetUsers({
      ...filters,
    });

  const users = data?.pages.flat() || [];

  const observer = useRef<IntersectionObserver | null>(null);

  // Callback для последнего элемента списка
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // useEffect(() => {
  //   if (skip === 0) {
  //     setUsers(fetchedUsers);
  //   } else if (fetchedUsers.length > 0) {
  //     setUsers((prev) => [...prev, ...fetchedUsers]);
  //   }
  // }, [fetchedUsers, skip]);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_isTouristModalOpen, setIsTouristModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [organizationAnnouncements, setOrganizationAnnouncements] = useState<
    any[]
  >([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);
  const [announcementsError, setAnnouncementsError] = useState<string | null>(
    null
  );

  const queryClient = useQueryClient();

  // Обновляем фильтры и сбрасываем skip
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
    setIsConfirmModalOpen(false);
    setSelectedOrganization(null);
    setConfirmAction(null);
  };

  const openConfirmActionModal = (action: "confirm" | "reject") => {
    setConfirmAction(action);
    setIsConfirmActionModalOpen(true);
  };

  const closeConfirmActionModal = () => {
    setIsConfirmActionModalOpen(false);
    setConfirmAction(null);
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

      await apiService.post({
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

      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });

      setConfirmAction(null);
      setIsConfirmActionModalOpen(false);
      setSelectedOrganization(null);
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Ошибка при выполнении действия:", error);
    }
  };

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Загрузка следующей порции пользователей
  const loadMoreUsers = () => {
    fetchNextPage();
  };

  const closeUserDetailsModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const openUserDetailsModal = async (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setOrganizationAnnouncements([]);
    setAnnouncementsLoading(true);
    setAnnouncementsError(null);

    if (user?.role === "бизнес" && user.organization?.id) {
      const orgId = user.organization.id;
      try {
        const response = await apiService.get<Announcement[]>({
          url: `/ad/by-org/${orgId}`,
        });
        if (response.status === 200) {
          setOrganizationAnnouncements(response.data);
          console.log("Полученные объявления:", response.data);
        } else {
          setAnnouncementsError(
            `Ошибка при загрузке объявлений: ${response.status}`
          );
        }
      } catch (error: any) {
        setAnnouncementsError(
          `Ошибка при загрузке объявлений: ${error.message}`
        );
      } finally {
        setAnnouncementsLoading(false);
      }
    } else {
      setAnnouncementsLoading(false);
    }
  };

  const handleBlockUser = async (orgId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-org/${orgId}`,
        dto: { value: true },
      });
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        setIsModalOpen(false);
      } else {
      }
    } catch (error) {
      console.error("Ошибка блокировки пользователя:", error);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-org/${userId}`,
        dto: { value: false },
      });
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        setIsModalOpen(false);
      } else {
      }
    } catch (error) {
      console.error("Ошибка разблокировки пользователя:", error);
    }
  };

  const handleBlockTourist = async (userId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-tourist/${userId}`,
        dto: { value: true },
      });
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        setIsTouristModalOpen(false);
      } else {
      }
    } catch (error) {
      console.error("Ошибка блокировки туриста:", error);
    }
  };
  const handleUnblockTourist = async (userId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-tourist/${userId}`,
        dto: { value: false },
      });
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        setIsTouristModalOpen(false);
      } else {
      }
    } catch (error) {
      console.error("Ошибка блокировки туриста:", error);
    }
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
              onClick={() => {
                if (filters.status !== UsersFilterStatus.WAITING) {
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                }
              }}
              disabled={filters.status === UsersFilterStatus.WAITING}
            >
              {filters.status === UsersFilterStatus.WAITING
                ? "Бизнес"
                : filters.role
                  ? capitalizeFirstLetter(filters.role)
                  : "Все пользователи"}
              <img src={Down} alt="" className="ml-[17px] w-[16px] h-[16px]" />
            </button>
            {isRoleDropdownOpen &&
              filters.status !== UsersFilterStatus.WAITING && (
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
                    onChange={() =>
                      updateFilters({ status: undefined, role: undefined })
                    }
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
                      onChange={() => {
                        if (status === UsersFilterStatus.WAITING) {
                          updateFilters({ status, role: RoleType.BUSINESS });
                        } else {
                          updateFilters({ status, role: undefined });
                        }
                      }}
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
          {isLoading && users.length === 0 ? (
            <Loader />
          ) : (
            <div className="grid gap-4">
              {users.map((user) => (
                <div
                  ref={lastElementRef}
                  key={user.id}
                  className="rounded-[16px] flex flex-wrap items-center bg-white md:flex-nowrap"
                >
                  <div
                    className="flex justify-between items-center h-[84px] pl-[32px] pt-[16px] pb-[16px] flex-1 min-w-[150px]"
                    onClick={() => openUserDetailsModal(user)}
                    style={{ cursor: "pointer" }}
                  >
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
                        {user.role === "бизнес" && user.organization?.name ? (
                          <h2 className="text-[16px] font-roboto">
                            {user.organization.name.length > 8
                              ? user.organization.name.substring(0, 8) + "..."
                              : user.organization.name}
                          </h2>
                        ) : user.fullName ? (
                          <h2 className="text-[16px] font-roboto">
                            {user.fullName.length > 6
                              ? user.fullName.substring(0, 6) + "..."
                              : user.fullName}
                          </h2>
                        ) : (
                          <div>
                            <p>Без названия</p>
                          </div>
                        )}

                        {user.role === "бизнес" && (
                          <p
                            className={`text-sm ${user.organization?.isConfirmCanceled ? "text-[#FF5959]" : user.organization?.isBanned ? "text-red" : "text-[#39B56B]"}`}
                          >
                            {user.organization?.isConfirmCanceled
                              ? "Отклонена"
                              : user.organization?.isBanned
                                ? "Заблокирован"
                                : ""}
                          </p>
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
                          className="text-[#39B56B] items-center pt-3 pb-3 pl-4 gap-4 flex border-[1px] border-[#39B56B] h-[48px] w-[186px] rounded-[16px] mr-[25px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            openConfirmModal(user.organization!);
                          }}
                        >
                          Подтверждение
                          <img
                            src={arrow}
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
              {hasNextPage && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={loadMoreUsers}
                    disabled={isFetchingNextPage}
                    className="bg-[#0A7D9E] w-[400px] h-[54px] text-white text-[16px] rounded-[32px] px-4 py-2"
                  >
                    {isFetchingNextPage ? "Загрузка..." : "Загрузить еще"}
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
                        : "Без названия"}
                    </Typography>
                    <p
                      className={`text-[14px] ${selectedOrganization.isConfirmCanceled ? "text-[#FF5959]" : "text-[#39B56B]"}`}
                    >
                      {selectedOrganization.isConfirmCanceled
                        ? "Отклонена"
                        : "Ожидание подтверждения"}
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
                className="w-[400px] pt-[18px] pr-[12px] pb-[18px] bg-[#39B56B] text-white rounded-[32px] font-medium"
              >
                Подтвердить аккаунт
              </button>
              {!selectedOrganization.isConfirmCanceled && (
                <button
                  onClick={handleRejectUser}
                  className="w-[400px] pt-[18px] pr-[12px] pb-[18px] bg-[#FF5959] text-white rounded-[32px] font-medium"
                >
                  Отклонить
                </button>
              )}
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
      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg max-h-[90vh] shadow-lg overflow-y-auto w-[772px]">
            <div className="flex items-center justify-between w-full">
              <button
                className="h-[44px] w-[44px]"
                onClick={closeUserDetailsModal}
              >
                <img src={Back} alt="Назад" className="w-6 h-6" />
              </button>
              <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] leading-[20px] tracking-[0.4px] text-center flex-grow">
                {selectedUser.role === "турист" ? (
                  <p>Турист</p>
                ) : selectedUser.role === "бизнес" ? (
                  <p>Организация</p>
                ) : (
                  <p>Детали пользователя</p>
                )}
              </h2>
              <button
                className="h-[44px] w-[44px]"
                onClick={closeUserDetailsModal}
              >
                <img src={Close} alt="Выход" className="w-full h-full" />
              </button>
            </div>
            <div>
              <div className="flex justify-center space-x-4">
                <img
                  className="w-[128px] h-[128px] rounded-full object-cover"
                  src={`${BASE_URL}${selectedUser.picture || selectedUser.organization?.imgUrl}`}
                  onError={(e) => (e.currentTarget.src = defaultImage)}
                />
              </div>
              <h2 className="font-roboto font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4">
                {selectedUser.fullName ||
                  selectedUser.organization?.name ||
                  "Без названия"}
              </h2>
            </div>

            {selectedUser.role === "турист" ? (
              <div>
                <div className="pt-3 pr-3 pb-[14px] pl-[12px]">
                  <p className="text-[#999999] text-[12px] flex">Email</p>
                  <Typography className="font-medium">
                    {selectedUser.email || "Не указан"}
                  </Typography>
                </div>
                <div className="pt-3 pr-3 pb-[14px] pl-[12px]">
                  <p className="text-[#999999] text-[12px] flex">
                    Phone Number
                  </p>
                  <Typography className="font-medium">
                    {selectedUser.phoneNumber || "Не указан"}
                  </Typography>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div>
                    <button
                      className="bg-white text-[#FF4545] border-[3px] font-medium border-[#FF4545] px-4 py-2 w-[400px] h-[54px] rounded-[32px] z-10"
                      onClick={() => {
                        handleBlockTourist(selectedUser.id);
                      }}
                    >
                      Заблокировать пользователя
                    </button>
                  </div>
                  <div>
                    <button
                      className="bg-[#39B56B] text-white px-4 py-2 font-medium w-[400px] h-[54px] rounded-[32px] z-10"
                      onClick={() => {
                        handleUnblockTourist(selectedUser.id);
                      }}
                    >
                      Разблокировать
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedUser.role === "бизнес" ? (
              <div>
                <div className="mt-4">
                  <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
                    <div className="flex flex-col items-start">
                      <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] text-black">
                        {selectedUser.website || "Не указан"}
                      </p>
                      <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                        Сайт
                      </strong>
                    </div>
                  </div>
                  <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
                    <div className="flex flex-col items-start">
                      <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px]">
                        {selectedUser.phone || "Не указан"}
                      </p>
                      <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                        Телефон
                      </strong>
                    </div>
                  </div>
                  <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
                    <div className="flex flex-col items-start">
                      <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px]">
                        {selectedUser.email || "Не указан"}
                      </p>
                      <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                        Email
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  {announcementsLoading ? (
                    <Loader />
                  ) : announcementsError ? (
                    <Typography color="error">{announcementsError}</Typography>
                  ) : organizationAnnouncements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {organizationAnnouncements.map((ad: any) => (
                        <div
                          key={ad.id}
                          onClick={() =>
                            navigate({
                              to: `/admin/announcements/${ad.id}`,
                            })
                          }
                        >
                          <AdCard ad={ad} isOrganization={true} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography className="text-gray-500">
                      Нет объявлений
                    </Typography>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div>
                    <button
                      className="bg-white text-[#FF4545] border-[3px] font-medium border-[#FF4545] px-4 py-2 w-[400px] h-[54px] rounded-[32px] z-10"
                      onClick={() => {
                        handleBlockUser(selectedUser.organization.id);
                      }}
                    >
                      Заблокировать пользователя
                    </button>
                  </div>
                  <div>
                    <button
                      className="bg-[#39B56B] text-white px-4 py-2 font-medium w-[400px] h-[54px] rounded-[32px] z-10"
                      onClick={() => {
                        handleUnblockUser(selectedUser.organization.id);
                      }}
                    >
                      Разблокировать
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

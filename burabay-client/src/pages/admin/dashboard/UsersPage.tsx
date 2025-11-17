import { useRef, useState, useEffect } from "react";
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
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { Button } from "../../../shared/ui/Button";
import { useToast, ToastContainer } from "../../../shared/ui/Toast";

import document from "/document.svg?url";
import confirmed from "/confirmed.svg?url";
import Close from "/Close.png?url";
import Down from "/down-arrow.svg?url";
import Back from "/Back.svg?url";
import arrow from "/arrow.svg?url";
import { AdCard } from "../../main/ui/AdCard";
import { Announcement } from "../../announcements/model/announcements";
import { useQueryClient } from "@tanstack/react-query";
import { AdminAnnouncementModal } from "../announcements/AdminAnnouncementModal";
import { UseGetAnnouncement } from "../../announcements/announcement/announcement-util";

interface Props {
  filters: UsersFilter;
  profile: Profile;
}

export default function UsersList({ filters }: Props) {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  // Локальное состояние для поискового запроса
  const [searchInput, setSearchInput] = useState(filters.searchQuery ?? "");
  const debouncedSearchInput = useDebounce(searchInput, 500);

  // Получаем пользователей с учетом пагинации
  const { data, isLoading } = useGetUsers({
    ...filters,
  });

  const users = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.page ?? 1;
  const total = data?.total ?? 0;

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
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<
    string | null
  >(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isBlockingLoading, setIsBlockingLoading] = useState(false);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Дебаунс для поискового запроса
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.searchQuery) {
        updateFilters({ searchQuery: searchInput });
      }
    }, 500); // 500ms задержка

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Синхронизация локального состояния с фильтрами при изменении извне
  useEffect(() => {
    if (filters.searchQuery !== searchInput) {
      setSearchInput(filters.searchQuery ?? "");
    }
  }, [filters.searchQuery]);

  // Обновляем фильтры и сбрасываем на первую страницу
  const updateFilters = (newFilters: Partial<UsersFilter>) => {
    navigate({
      to: "/admin/dashboard/users",
      search: {
        ...filters,
        ...newFilters,
        page: 1, // Сбрасываем на первую страницу при изменении фильтров
      },
    });
  };

  // Метод для смены страницы
  const changePage = (newPage: number) => {
    navigate({
      to: "/admin/dashboard/users",
      search: {
        ...filters,
        page: newPage,
      },
    });
  };

  // Метод для смены количества записей на странице
  const changePageSize = (newTake: number) => {
    navigate({
      to: "/admin/dashboard/users",
      search: {
        ...filters,
        take: newTake,
        page: 1, // Сбрасываем на первую страницу
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
    } catch (error) {}
  };

  // Простая пагинация - показываем только текущую страницу
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    // Если страниц мало (до 7), показываем все
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Всегда показываем первую страницу
    pages.push(1);

    // Логика для отображения средних страниц
    if (currentPage <= 3) {
      // Если в начале: 1 2 3 4 ... последняя
      pages.push(2, 3, 4);
      pages.push("...");
    } else if (currentPage >= totalPages - 2) {
      // Если в конце: 1 ... предпоследние 3 страницы
      pages.push("...");
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      // Если в середине: 1 ... текущая-1 текущая текущая+1 ... последняя
      pages.push("...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...");
    }

    // Всегда показываем последнюю страницу
    pages.push(totalPages);

    return pages;
  };

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
    setIsBlockingLoading(true);
    setBlockingUserId(orgId);
    try {
      const response = await apiService.patch({
        url: `/admin/ban-org/${orgId}`,
        dto: { value: true },
      });
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        const orgName = selectedUser?.organization?.name || "Организация";
        setSelectedUser((prev: any) => ({
          ...prev,
          organization: { ...prev.organization, isBanned: true },
        }));
        showToast(`Организация "${orgName}" успешно заблокирована`, "success");
      }
    } catch (error) {
      showToast("Ошибка при блокировке организации", "error");
    } finally {
      setIsBlockingLoading(false);
      setBlockingUserId(null);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    setIsBlockingLoading(true);
    setBlockingUserId(userId);
    try {
      const response = await apiService.patch({
        url: `/admin/ban-org/${userId}`,
        dto: { value: false },
      });
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        const orgName = selectedUser?.organization?.name || "Организация";
        setSelectedUser((prev: any) => ({
          ...prev,
          organization: { ...prev.organization, isBanned: false },
        }));
        showToast(`Организация "${orgName}" успешно разблокирована`, "success");
      }
    } catch (error) {
      showToast("Ошибка при разблокировке организации", "error");
    } finally {
      setIsBlockingLoading(false);
      setBlockingUserId(null);
    }
  };

  const handleBlockTourist = async (userId: string) => {
    setIsBlockingLoading(true);
    setBlockingUserId(userId);
    try {
      const response = await apiService.patch({
        url: `/admin/ban-tourist/${userId}`,
        dto: { value: true },
      });
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        const userName = selectedUser?.fullName || "Турист";
        setSelectedUser((prev: any) => ({
          ...prev,
          isBanned: true,
        }));
        showToast(`Пользователь "${userName}" успешно заблокирован`, "success");
      }
    } catch (error) {
      showToast("Ошибка при блокировке пользователя", "error");
    } finally {
      setIsBlockingLoading(false);
      setBlockingUserId(null);
    }
  };

  const handleUnblockTourist = async (userId: string) => {
    setIsBlockingLoading(true);
    setBlockingUserId(userId);
    try {
      const response = await apiService.patch({
        url: `/admin/ban-tourist/${userId}`,
        dto: { value: false },
      });
      if (response.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        const userName = selectedUser?.fullName || "Турист";
        setSelectedUser((prev: any) => ({
          ...prev,
          isBanned: false,
        }));
        showToast(`Пользователь "${userName}" успешно разблокирован`, "success");
      }
    } catch (error) {
      showToast("Ошибка при разблокировке пользователя", "error");
    } finally {
      setIsBlockingLoading(false);
      setBlockingUserId(null);
    }
  };

  return (
    <div className="relative min-h-screen flex">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35"></div>
      <div
        className="fixed inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>
      <div className="relative z-50">
        <SideNav />
      </div>
      <div className="relative z-10 flex flex-col w-full ml-[94px] h-screen pt-4">
        <div className="fixed top-0 left-[94px] right-0 border-[2px] border-[#E4E9EA] bg-white rounded-b-[16px] p-4 z-20 flex space-x-4 mx-[16px] items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Поиск по email, телефону или названию"
              className="p-2 pr-10 border rounded-[8px] bg-[#FAF9F7] border-[#EDECEA] h-[52px] w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSearchInput("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#0a7d9e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>

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

          <div className="relative min-w-fit" ref={statusFilterRef}>
            <button
              type="button"
              className="w-[264.5px] min-w-fit flex items-center justify-center text-[#0A7D9E] pt-[12px] pr-[32px] pb-[12px] pl-[32px] border-[1px] rounded-[8px] border-[#0A7D9E] bg-white"
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

        <div className="flex-1 overflow-y-auto admin-scrollbar p-4 pt-24">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-[16px] flex flex-wrap items-center bg-white md:flex-nowrap"
                  >
                    <div
                      className="flex justify-between items-center h-[84px] pl-[32px] pt-[16px] pb-[16px] flex-1 min-w-[150px] gap-2"
                      onClick={() => openUserDetailsModal(user)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="flex items-center space-x-4 flex-1">
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

                        <div className="h-[58px] flex flex-col justify-center flex-1 min-w-0">
                          {user.role === "бизнес" && user.organization?.name ? (
                            <h2 className="text-[16px] font-roboto truncate max-w-[200px]">
                              {user.organization.name}
                            </h2>
                          ) : user.fullName ? (
                            <h2 className="text-[16px] font-roboto truncate max-w-[200px]">
                              {user.fullName}
                            </h2>
                          ) : (
                            <h2 className="text-[16px] font-roboto">
                              Без названия
                            </h2>
                          )}

                          {user.role === "бизнес" && (
                            <p
                              className={`text-sm ${user.organization?.isConfirmCanceled ? "text-[#FF5959]" : user.organization?.isBanned ? "text-[#FF5959]" : "text-[#39B56B]"}`}
                            >
                              {user.organization?.isConfirmCanceled
                                ? "Отклонена"
                                : user.organization?.isBanned
                                  ? "Заблокирован"
                                  : user.organization?.isConfirmed
                                    ? "Подтвержден"
                                    : ""}
                            </p>
                          )}

                          {user.role === "турист" && (
                            <p
                              className={`text-sm ${
                                user.isBanned
                                  ? "text-red-500"
                                  : "text-[#39B56B]"
                              }`}
                            >
                              {user.isBanned ? "Заблокирован" : "Подтвержден"}
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
                        !user.organization?.isBanned &&
                        (user.organization?.isConfirmed ? (
                          <div className="flex items-center mr-8">
                            <span className="text-[#0A7D9E] mr-4">
                              Подтвержден
                            </span>
                            <img src={confirmed} alt="confirmed" />
                          </div>
                        ) : (
                          <button
                            className="text-[#39B56B] items-center py-3 px-4 gap-2 flex border-[1px] border-[#39B56B] h-[48px] min-w-fit rounded-[16px] mr-[32px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              openConfirmModal(user.organization!);
                            }}
                          >
                            Подтверждение
                            <img src={arrow} alt="" className="w-2"></img>
                          </button>
                        ))}
                    </div>

                    <div className="border-l-[2px] h-full border-[#E4E9EA] flex-1 flex items-center min-w-0">
                      <div className="pl-[32px] flex-1 min-w-0">
                        <p className="truncate">{user.phoneNumber || "—"}</p>
                        <p className="text-[12px] text-[#999999]">
                          Номер телефона для связи
                        </p>
                      </div>
                    </div>

                    <div className="border-l-[2px] h-full border-[#E4E9EA] pl-[32px] flex-1 flex items-center min-w-0">
                      <div className="min-w-0 pr-4">
                        <p className="truncate">{user.email || "—"}</p>
                        <p className="text-[12px] text-[#999999]">
                          Email адрес для связи
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Пагинация */}
              <div className="bg-white p-4 rounded-[16px]">
                <div className="flex justify-between items-center">
                  {/* Левая часть: информация и селектор */}
                  <div className="flex items-center gap-3 text-[13px] text-[#666]">
                    <span className="whitespace-nowrap">
                      {users.length > 0
                        ? (currentPage - 1) * (filters.take ?? 10) + 1
                        : 0}
                      –{Math.min(currentPage * (filters.take ?? 10), total)} из{" "}
                      {total}
                    </span>

                    {/* Селектор количества записей */}
                    <select
                      value={filters.take ?? 10}
                      onChange={(e) => changePageSize(Number(e.target.value))}
                      className="text-[#0A7D9E] py-2 pr-6 pl-4 border-[1px] rounded-[8px] border-[#0A7D9E] bg-white cursor-pointer appearance-none bg-no-repeat bg-right outline-none"
                      style={{
                        backgroundImage: `url(${Down})`,
                        backgroundPosition: "right 8px center",
                        backgroundSize: "8px 8px",
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  {/* Правая часть: компактная пагинация */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      {/* Кнопка "Назад" */}
                      <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-7 h-7 flex items-center justify-center border rounded-[6px] border-[#E0E0E0] bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F5F5F5] hover:border-[#0A7D9E] transition-all"
                        title="Назад"
                      >
                        <img src={Back} alt="←" className="w-3 h-3" />
                      </button>

                      {/* Номера страниц */}
                      {getPageNumbers().map((pageNum, index) => {
                        if (pageNum === "...") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="w-7 h-7 flex items-center justify-center text-[12px] text-[#999]"
                            >
                              ···
                            </span>
                          );
                        }

                        const isActive = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => changePage(pageNum as number)}
                            className={`
                              w-7 h-7 flex items-center justify-center text-[12px] border rounded-[6px] transition-all
                              ${
                                isActive
                                  ? "bg-[#0A7D9E] text-white border-[#0A7D9E] font-semibold"
                                  : "bg-white text-[#333] border-[#E0E0E0] hover:bg-[#F5F5F5] hover:border-[#0A7D9E]"
                              }
                            `}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Кнопка "Вперед" */}
                      <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="w-7 h-7 flex items-center justify-center border rounded-[6px] border-[#E0E0E0] bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F5F5F5] hover:border-[#0A7D9E] transition-all"
                        title="Вперед"
                      >
                        <img src={arrow} alt="→" className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isConfirmModalOpen && selectedOrganization && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white h-[636px] p-4 rounded-lg shadow-lg w-[470px]">
            <div className="space-y-[8px]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4 flex-1">
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
                  {selectedOrganization.bin || "Не указан"}
                </Typography>
              </div>

              <div className="pt-3 pr-3 pb-[14px] pl-[12px]">
                <p className="text-[#999999] text-[12px] flex">
                  {"Номер телефона"}
                </p>
                <Typography>
                  {selectedOrganization.phoneNumber || "Не указан"}
                </Typography>
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
                        <span className="text-black">
                          {selectedOrganization.regCouponPath
                            .split("/")
                            .pop() || "Документ"}
                        </span>
                      ) : (
                        <Typography className="text-red-500 text-sm">
                          Документ не загружен
                        </Typography>
                      )}
                    </div>
                    {selectedOrganization.regCouponPath && (
                      <a
                        href={`${BASE_URL}/download/docs${selectedOrganization.regCouponPath.replace("/public/docs", "")}`}
                        className="ml-2"
                      >
                        <img
                          src={downloadIcon}
                          alt="Скачать"
                          className="cursor-pointer hover:opacity-70"
                        />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img src={document} alt="doc" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-[12px] text-[#999999]">Справка IBAN</p>
                      {selectedOrganization.ibanDocPath ? (
                        <span className="text-black">
                          {selectedOrganization.ibanDocPath.split("/").pop() ||
                            "Документ"}
                        </span>
                      ) : (
                        <Typography className="text-red-500 text-sm">
                          Документ не загружен
                        </Typography>
                      )}
                    </div>
                    {selectedOrganization.ibanDocPath && (
                      <a
                        href={`${BASE_URL}/download/docs${selectedOrganization.ibanDocPath.replace("/public/docs", "")}`}
                        className="ml-2"
                      >
                        <img
                          src={downloadIcon}
                          alt="Скачать"
                          className="cursor-pointer hover:opacity-70"
                        />
                      </a>
                    )}
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
                        <span className="text-black">
                          {selectedOrganization.orgRulePath.split("/").pop() ||
                            "Документ"}
                        </span>
                      ) : (
                        <Typography className="text-red-500 text-sm">
                          Документ не загружен
                        </Typography>
                      )}
                    </div>
                    {selectedOrganization.orgRulePath && (
                      <a
                        href={`${BASE_URL}/download/docs${selectedOrganization.orgRulePath.replace("/public/docs", "")}`}
                        className="ml-2"
                      >
                        <img
                          src={downloadIcon}
                          alt="Скачать"
                          className="cursor-pointer hover:opacity-70"
                        />
                      </a>
                    )}
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
          <div className="bg-white rounded-[16px] w-[480px] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <Typography className="text-[18px] font-semibold">
                {confirmAction === "confirm"
                  ? "Подтвердить аккаунт?"
                  : "Отклонить аккаунт?"}
              </Typography>
              <button
                onClick={closeConfirmActionModal}
                className="h-[28px] w-[28px] flex-shrink-0"
              >
                <img src={Close} alt="Закрыть" className="w-full h-full" />
              </button>
            </div>
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={closeConfirmActionModal}
                className="px-6 py-3 border border-gray-300 rounded-[32px] hover:bg-gray-50 transition-colors font-medium text-black"
              >
                Отмена
              </button>
              <button
                onClick={confirmActionHandler}
                className={`px-6 py-3 rounded-[32px] text-white font-medium transition-opacity hover:opacity-80 ${
                  confirmAction === "confirm" ? "bg-[#39B56B]" : "bg-[#FF5959]"
                }`}
              >
                {confirmAction === "confirm" ? "Подтвердить" : "Отклонить"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-[16px] max-h-[90vh] shadow-lg w-[600px] flex flex-col overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-[#E4E9EA] flex items-center justify-between w-full p-4 z-10">
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
            <div className="overflow-y-auto admin-scrollbar flex-1 flex flex-col">
              <div className="p-4">
                <div className="flex justify-center space-x-4">
                  <img
                    className="w-[128px] h-[128px] rounded-full object-cover"
                    src={`${BASE_URL}${selectedUser.picture || selectedUser.organization?.imgUrl}`}
                    onError={(e) => (e.currentTarget.src = defaultImage)}
                  />
                </div>
              <h2 className="font-roboto font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4 truncate px-4">
                {selectedUser.fullName ||
                  selectedUser.organization?.name ||
                  "Без названия"}
              </h2>
            </div>

            {selectedUser.role === "турист" ? (
              <div>
                <div className="pt-3 pr-3 pb-[14px] pl-[12px] min-w-0">
                  <p className="text-[#999999] text-[12px] flex">Email</p>
                  <Typography className="font-medium truncate">
                    {selectedUser.email || "Не указан"}
                  </Typography>
                </div>
                <div className="pt-3 pr-3 pb-[14px] pl-[12px] min-w-0">
                  <p className="text-[#999999] text-[12px] flex">
                    Phone Number
                  </p>
                  <Typography className="font-medium truncate">
                    {selectedUser.phoneNumber || "Не указан"}
                  </Typography>
                </div>
              </div>
            ) : selectedUser.role === "бизнес" ? (
              <div className="flex-1 flex flex-col">
                <div className="px-4 pt-4">
                  <div className="flex items-center border-t border-[#E4E9EA] gap-3 py-4 px-4 min-w-0">
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] text-black truncate w-full">
                        {selectedUser.website || "Не указан"}
                      </p>
                      <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                        Сайт
                      </strong>
                    </div>
                  </div>
                  <div className="flex items-center border-t border-[#E4E9EA] gap-3 py-4 px-4 min-w-0">
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] truncate w-full">
                        {selectedUser.phone || "Не указан"}
                      </p>
                      <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                        Телефон
                      </strong>
                    </div>
                  </div>
                  <div className="flex items-center border-t border-[#E4E9EA] gap-3 py-4 px-4 min-w-0">
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] truncate w-full">
                        {selectedUser.email || "Не указан"}
                      </p>
                      <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                        Email
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex-1 px-4">
                  {announcementsLoading ? (
                    <Loader />
                  ) : announcementsError ? (
                    <Typography color="error">{announcementsError}</Typography>
                  ) : organizationAnnouncements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {organizationAnnouncements.map((ad: any) => (
                        <div
                          key={ad.id}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedAnnouncementId(ad.id);
                            setIsAnnouncementModalOpen(true);
                          }}
                        >
                          <AdCard
                            ad={ad}
                            isOrganization={true}
                            disableLink={true}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Typography className="text-gray-500">
                      Нет объявлений
                    </Typography>
                  )}
                </div>
              </div>
            ) : (
              <div></div>
            )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-[#E4E9EA] flex flex-col items-center gap-4 px-4 py-4 z-10">
              {selectedUser && (selectedUser.role === "турист" ? (
                selectedUser.isBanned ? (
                  <button
                    className="bg-[#39B56B] text-white px-4 py-2 font-medium w-full max-w-[500px] h-[54px] rounded-[32px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    onClick={() => {
                      handleUnblockTourist(selectedUser.id);
                    }}
                    disabled={isBlockingLoading && blockingUserId === selectedUser.id}
                  >
                    {isBlockingLoading && blockingUserId === selectedUser.id ? (
                      <>
                        <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Обработка...
                      </>
                    ) : (
                      "Разблокировать"
                    )}
                  </button>
                ) : (
                  <button
                    className="bg-white text-[#FF4545] border-[3px] font-medium border-[#FF4545] px-4 py-2 w-full max-w-[500px] h-[54px] rounded-[32px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    onClick={() => {
                      handleBlockTourist(selectedUser.id);
                    }}
                    disabled={isBlockingLoading && blockingUserId === selectedUser.id}
                  >
                    {isBlockingLoading && blockingUserId === selectedUser.id ? (
                      <>
                        <div className="animate-spin mr-2 w-4 h-4 border-2 border-[#FF4545] border-t-transparent rounded-full"></div>
                        Обработка...
                      </>
                    ) : (
                      "Заблокировать пользователя"
                    )}
                  </button>
                )
              ) : selectedUser.role === "бизнес" ? (
                selectedUser.organization?.isBanned ? (
                  <button
                    className="bg-[#39B56B] text-white px-4 py-2 font-medium w-full max-w-[500px] h-[54px] rounded-[32px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    onClick={() => {
                      handleUnblockUser(selectedUser.organization.id);
                    }}
                    disabled={isBlockingLoading && blockingUserId === selectedUser.organization.id}
                  >
                    {isBlockingLoading && blockingUserId === selectedUser.organization.id ? (
                      <>
                        <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Обработка...
                      </>
                    ) : (
                      "Разблокировать"
                    )}
                  </button>
                ) : (
                  <button
                    className="bg-white text-[#FF4545] border-[3px] font-medium border-[#FF4545] px-4 py-2 w-full max-w-[500px] h-[54px] rounded-[32px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    onClick={() => {
                      handleBlockUser(selectedUser.organization.id);
                    }}
                    disabled={isBlockingLoading && blockingUserId === selectedUser.organization.id}
                  >
                    {isBlockingLoading && blockingUserId === selectedUser.organization.id ? (
                      <>
                        <div className="animate-spin mr-2 w-4 h-4 border-2 border-[#FF4545] border-t-transparent rounded-full"></div>
                        Обработка...
                      </>
                    ) : (
                      "Заблокировать пользователя"
                    )}
                  </button>
                )
              ) : null)}
            </div>
          </div>
        </div>
      )}
      {selectedAnnouncementId && (
        <AnnouncementModalWrapper
          announcementId={selectedAnnouncementId}
          open={isAnnouncementModalOpen}
          onClose={() => {
            setIsAnnouncementModalOpen(false);
            setSelectedAnnouncementId(null);
          }}
          onBack={() => {
            setIsAnnouncementModalOpen(false);
            setSelectedAnnouncementId(null);
          }}
        />
      )}
    </div>
  );
}

// Компонент-обертка для загрузки объявления
function AnnouncementModalWrapper({
  announcementId,
  open,
  onClose,
  onBack,
}: {
  announcementId: string;
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
}) {
  const { data, isLoading } = UseGetAnnouncement(announcementId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-4">
          <Loader />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <AdminAnnouncementModal
      announcement={data}
      open={open}
      onClose={onBack || onClose}
    />
  );
}

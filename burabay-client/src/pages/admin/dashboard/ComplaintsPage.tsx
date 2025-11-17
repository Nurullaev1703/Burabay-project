import { FC, useEffect, useState, useCallback, useRef } from "react";
import SideNav from "../../../components/admin/SideNav";
import { apiService } from "../../../services/api/ApiService";
import { RatingStars } from "../../../shared/ui/RatingStars";
import { AdCard } from "../../main/ui/AdCard";
import authBg from "../../../app/icons/bg_auth.png";
import { Announcement } from "../../announcements/model/announcements";
import { baseUrl } from "../../../services/api/ServerData";
import { CoveredImage } from "../../../shared/ui/CoveredImage";
import defaultImage from "../../../app/icons/abstract-bg.svg";
import { Loader } from "../../../components/Loader";
import noComp from "../../../app/icons/noComp.svg?url";
import { useNavigate } from "@tanstack/react-router";
import { AdminAnnouncementModal } from "../announcements/AdminAnnouncementModal";
import { UseGetAnnouncement } from "../../announcements/announcement/announcement-util";
import { useToast, ToastContainer } from "../../../shared/ui/Toast";

import Back from "/Back.svg?url";
import Close from "/Close.png?url";

const LOCAL_STORAGE_DELETION_KEY = "delayedDeletions";
const LOCAL_STORAGE_ACCEPTANCE_KEY = "delayedAcceptances";
const LOCAL_STORAGE_DELETION_TIMERS_KEY = "delayedDeletionTimers";
const LOCAL_STORAGE_ACCEPTANCE_TIMERS_KEY = "delayedAcceptanceTimers";
const DELETION_TIMEOUT_MS = 5 * 1000; // 5 секунд
const ACCEPTANCE_TIMEOUT_MS = 5 * 1000; // 5 секунд

const BASE_URL = baseUrl;

interface Review {
  reviewId: string;
  username: string;
  reviewDate: string;
  reviewStars: number;
  reviewText: string;
  reviewImages?: string[];
  adImage: string;
  adName: string;
  adReviewCount: number;
  adRating: number;
  orgName: string | null;
  orgImage: string | null;
  reportText: string;
  reportData: string;
  id: string;
  organization: Organization;
  orgId: string;
  user: User;
  userId: string;
  delayedRemoval?: boolean;
  status?: "deleted" | "accepted";
  adId: string;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  website?: string;
  phone?: string;
  user: { id: string; email: string };
  ads: Announcement[];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  isEmailConfirmed: boolean;
  organization: Organization;
  phoneNumber: string;
  picture: string;
  isBanned: boolean;
}

export const ComplaintsPage: FC = function ComplaintsPage({}) {
  const { toasts, showToast, removeToast } = useToast();
  const [reviews, setReviews] = useState<
    (Review & {
      hint: { message: string; type: "success" | "error" } | null;
      delayedRemoval?: boolean;
      status?: "deleted" | "accepted";
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [_isExpanded, setIsExpanded] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(20);
  const navigate = useNavigate();

  const [isTouristModalOpen, setIsTouristModalOpen] = useState(false);
  const [selectedTourist, setSelectedTourist] = useState<User | null>(null);
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
  const [deletionTimers, setDeletionTimers] = useState<Record<string, number>>(
    {}
  ); // reviewId -> remaining time in ms
  const [acceptanceTimers, setAcceptanceTimers] = useState<Record<string, number>>(
    {}
  ); // reviewId -> remaining time in ms
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const isExecutingRef = useRef(false); // Флаг для предотвращения повторного выполнения
  const timerIntervalsRef = useRef<Record<string, NodeJS.Timeout>>({}); // Храним интервалы таймеров удаления
  const acceptanceTimerIntervalsRef = useRef<Record<string, NodeJS.Timeout>>({}); // Храним интервалы таймеров принятия

  // Функция для выполнения всех отложенных запросов (useCallback для стабильной ссылки)
  const executePendingRequests = useCallback(async () => {
    // Предотвращаем параллельное выполнение
    if (isExecutingRef.current) {
      return;
    }

    isExecutingRef.current = true;

    try {
      const storedDeletions = localStorage.getItem(LOCAL_STORAGE_DELETION_KEY);
      const storedAcceptances = localStorage.getItem(
        LOCAL_STORAGE_ACCEPTANCE_KEY
      );

      const promises: Promise<unknown>[] = [];

      // Собираем все запросы на удаление
      if (storedDeletions) {
        const parsedDeletions: Record<string, boolean> =
          JSON.parse(storedDeletions);
        Object.keys(parsedDeletions).forEach((reviewId) => {
          promises.push(
            apiService.delete({ url: `/review/${reviewId}` }).catch((error) => {
              console.error(`Ошибка удаления отзыва ${reviewId}:`, error);
            })
          );
        });
      }

      // Собираем все запросы на принятие
      if (storedAcceptances) {
        const parsedAcceptances: Record<string, boolean> =
          JSON.parse(storedAcceptances);
        Object.keys(parsedAcceptances).forEach((reviewId) => {
          promises.push(
            apiService
              .patch({ url: `/admin/check-review/${reviewId}`, dto: {} })
              .catch((error) => {
                console.error(`Ошибка принятия отзыва ${reviewId}:`, error);
              })
          );
        });
      }

      // Выполняем все запросы параллельно
      if (promises.length > 0) {
        await Promise.all(promises);

        // Очищаем localStorage только после успешного выполнения
        if (storedDeletions)
          localStorage.removeItem(LOCAL_STORAGE_DELETION_KEY);
        if (storedAcceptances)
          localStorage.removeItem(LOCAL_STORAGE_ACCEPTANCE_KEY);
      }
    } catch (error) {
      console.error("Ошибка при выполнении отложенных запросов:", error);
    } finally {
      isExecutingRef.current = false;
    }
  }, []); // Пустой массив зависимостей - функция стабильна

  // Синхронная версия для beforeunload (отправляет запросы через sendBeacon)
  const executePendingRequestsSync = useCallback(() => {
    const storedDeletions = localStorage.getItem(LOCAL_STORAGE_DELETION_KEY);
    const storedAcceptances = localStorage.getItem(
      LOCAL_STORAGE_ACCEPTANCE_KEY
    );

    // sendBeacon для надежной отправки при закрытии страницы
    if (storedDeletions) {
      const parsedDeletions: Record<string, boolean> =
        JSON.parse(storedDeletions);
      Object.keys(parsedDeletions).forEach((reviewId) => {
        // Используем sendBeacon для надежной отправки
        const url = `${baseUrl}/review/${reviewId}`;
        navigator.sendBeacon(url, JSON.stringify({ method: "DELETE" }));
      });
      localStorage.removeItem(LOCAL_STORAGE_DELETION_KEY);
    }

    if (storedAcceptances) {
      const parsedAcceptances: Record<string, boolean> =
        JSON.parse(storedAcceptances);
      Object.keys(parsedAcceptances).forEach((reviewId) => {
        const url = `${baseUrl}/admin/check-review/${reviewId}`;
        navigator.sendBeacon(url, JSON.stringify({ method: "PATCH" }));
      });
      localStorage.removeItem(LOCAL_STORAGE_ACCEPTANCE_KEY);
    }
  }, []);

  // Единый useEffect для управления жизненным циклом
  useEffect(() => {
    // При монтировании - выполняем отложенные запросы (после перезагрузки)
    executePendingRequests();

    // Обработчик beforeunload для закрытия/перезагрузки страницы
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasPending =
        localStorage.getItem(LOCAL_STORAGE_DELETION_KEY) ||
        localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE_KEY);

      if (hasPending) {
        // Выполняем синхронную версию
        executePendingRequestsSync();

        // Показываем предупреждение (необязательно, но полезно)
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // При размонтировании - выполняем отложенные запросы (переход на другой маршрут)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      executePendingRequests();
    };
  }, [executePendingRequests, executePendingRequestsSync]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiService.get<Review[]>({
          url: "/admin/reports",
        });

        if (response.status === 200) {
          const storedDeletions = localStorage.getItem(
            LOCAL_STORAGE_DELETION_KEY
          );
          const parsedDeletions: Record<string, boolean> = storedDeletions
            ? JSON.parse(storedDeletions)
            : {};
          const storedAcceptances = localStorage.getItem(
            LOCAL_STORAGE_ACCEPTANCE_KEY
          );
          const parsedAcceptances: Record<string, boolean> = storedAcceptances
            ? JSON.parse(storedAcceptances)
            : {};

          setReviews(
            response.data.map((review) => {
              const isMarkedForDeletion = parsedDeletions[review.reviewId];
              const isMarkedForAcceptance = parsedAcceptances[review.reviewId];

              return {
                ...review,
                hint: isMarkedForDeletion
                  ? {
                      message:
                        "Отзыв будет удален при переходе или перезагрузке",
                      type: "success",
                    }
                  : isMarkedForAcceptance
                    ? {
                        message:
                          "Отзыв будет принят при переходе или перезагрузке",
                        type: "success",
                      }
                    : null,
                delayedRemoval: isMarkedForDeletion || isMarkedForAcceptance,
                status: isMarkedForDeletion
                  ? "deleted"
                  : isMarkedForAcceptance
                    ? "accepted"
                    : undefined,
              };
            })
          );
        } else {
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();

    const intervalId = setInterval(fetchReviews, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    setIsDeleteLoading(true);
    setDeleteLoadingId(reviewId);
    try {
      const response = await apiService.delete({
        url: `/admin/review/${reviewId}`,
      });
      if (response.status === 200) {
        // Помечаем в localStorage
        const updatedDeletions = JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_DELETION_KEY) || "{}"
        );
        updatedDeletions[reviewId] = true;
        localStorage.setItem(
          LOCAL_STORAGE_DELETION_KEY,
          JSON.stringify(updatedDeletions)
        );

        // Устанавливаем таймер для этого отзыва
        setDeletionTimers((prev) => ({
          ...prev,
          [reviewId]: DELETION_TIMEOUT_MS,
        }));

        // Сохраняем время в localStorage для восстановления при перезагрузке
        const storedTimers = JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_DELETION_TIMERS_KEY) || "{}"
        );
        storedTimers[reviewId] = Date.now() + DELETION_TIMEOUT_MS;
        localStorage.setItem(
          LOCAL_STORAGE_DELETION_TIMERS_KEY,
          JSON.stringify(storedTimers)
        );

        // Обновляем UI
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.reviewId === reviewId
              ? {
                  ...review,
                  hint: {
                    message: "Отзыв будет удален",
                    type: "success" as const,
                  },
                  delayedRemoval: true,
                  status: "deleted" as const,
                }
              : review
          )
        );
        showToast("Отзыв успешно удален", "success");
      }
    } catch (error) {
      showToast("Ошибка при удалении отзыва", "error");
    } finally {
      setIsDeleteLoading(false);
      setDeleteLoadingId(null);
    }
  };

  const handleAcceptReview = useCallback((reviewId: string) => {
    // Помечаем в localStorage
    const updatedAcceptances = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE_KEY) || "{}"
    );
    updatedAcceptances[reviewId] = true;
    localStorage.setItem(
      LOCAL_STORAGE_ACCEPTANCE_KEY,
      JSON.stringify(updatedAcceptances)
    );

    // Устанавливаем таймер для этого отзыва
    setAcceptanceTimers((prev) => ({
      ...prev,
      [reviewId]: ACCEPTANCE_TIMEOUT_MS,
    }));

    // Сохраняем время в localStorage для восстановления при перезагрузке
    const storedTimers = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE_TIMERS_KEY) || "{}"
    );
    storedTimers[reviewId] = Date.now() + ACCEPTANCE_TIMEOUT_MS;
    localStorage.setItem(
      LOCAL_STORAGE_ACCEPTANCE_TIMERS_KEY,
      JSON.stringify(storedTimers)
    );

    // Обновляем UI
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.reviewId === reviewId
          ? {
              ...review,
              hint: {
                message: "Отзыв будет принят",
                type: "success" as const,
              },
              delayedRemoval: true,
              status: "accepted" as const,
            }
          : review
      )
    );
  }, []);

  const handleCancelHint = useCallback((reviewId: string) => {
    // Убираем из UI и localStorage
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.reviewId === reviewId
          ? {
              ...review,
              hint: null,
              status: undefined,
              delayedRemoval: false,
            }
          : review
      )
    );

    // Очищаем таймер удаления
    setDeletionTimers((prev) => {
      const updated = { ...prev };
      delete updated[reviewId];
      return updated;
    });

    // Очищаем таймер принятия
    setAcceptanceTimers((prev) => {
      const updated = { ...prev };
      delete updated[reviewId];
      return updated;
    });

    // Убираем интервалы для этих таймеров
    if (timerIntervalsRef.current[reviewId]) {
      clearInterval(timerIntervalsRef.current[reviewId]);
      delete timerIntervalsRef.current[reviewId];
    }

    if (acceptanceTimerIntervalsRef.current[reviewId]) {
      clearInterval(acceptanceTimerIntervalsRef.current[reviewId]);
      delete acceptanceTimerIntervalsRef.current[reviewId];
    }

    // Удаляем из localStorage
    const storedDeletions = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_DELETION_KEY) || "{}"
    );
    delete storedDeletions[reviewId];
    localStorage.setItem(
      LOCAL_STORAGE_DELETION_KEY,
      JSON.stringify(storedDeletions)
    );

    const storedAcceptances = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE_KEY) || "{}"
    );
    delete storedAcceptances[reviewId];
    localStorage.setItem(
      LOCAL_STORAGE_ACCEPTANCE_KEY,
      JSON.stringify(storedAcceptances)
    );

    const storedDeletionTimers = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_DELETION_TIMERS_KEY) || "{}"
    );
    delete storedDeletionTimers[reviewId];
    localStorage.setItem(
      LOCAL_STORAGE_DELETION_TIMERS_KEY,
      JSON.stringify(storedDeletionTimers)
    );

    const storedAcceptanceTimers = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE_TIMERS_KEY) || "{}"
    );
    delete storedAcceptanceTimers[reviewId];
    localStorage.setItem(
      LOCAL_STORAGE_ACCEPTANCE_TIMERS_KEY,
      JSON.stringify(storedAcceptanceTimers)
    );
  }, []);

  // useEffect для управления таймерами удаления
  useEffect(() => {
    // Восстанавливаем таймеры из localStorage при монтировании
    const storedTimers = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_DELETION_TIMERS_KEY) || "{}"
    );
    const now = Date.now();
    const restoredTimers: Record<string, number> = {};

    Object.entries(storedTimers).forEach(([reviewId, endTime]: [string, any]) => {
      const remaining = endTime - now;
      if (remaining > 0) {
        restoredTimers[reviewId] = remaining;
      } else {
        // Время вышло, удаляем из localStorage
        delete storedTimers[reviewId];
      }
    });

    localStorage.setItem(
      LOCAL_STORAGE_DELETION_TIMERS_KEY,
      JSON.stringify(storedTimers)
    );

    if (Object.keys(restoredTimers).length > 0) {
      setDeletionTimers(restoredTimers);
    }
  }, []);

  // useEffect для управления интервалами таймеров
  useEffect(() => {
    Object.entries(deletionTimers).forEach(([reviewId, remaining]) => {
      // Если таймер уже существует, не создаём новый
      if (timerIntervalsRef.current[reviewId]) {
        return;
      }

      // Создаём интервал для этого таймера
      const intervalId = setInterval(() => {
        setDeletionTimers((prev) => {
          const updated = { ...prev };
          const newRemaining = (updated[reviewId] || 0) - 100; // Уменьшаем на 100ms

          if (newRemaining <= 0) {
            // Время истекло, выполняем удаление
            clearInterval(timerIntervalsRef.current[reviewId]);
            delete timerIntervalsRef.current[reviewId];

            // Автоматически выполняем удаление
            apiService
              .delete({ url: `/review/${reviewId}` })
              .then(() => {
                // Удаляем из UI и localStorage
                setReviews((prevReviews) =>
                  prevReviews.filter((r) => r.reviewId !== reviewId)
                );

                const storedDeletions = JSON.parse(
                  localStorage.getItem(LOCAL_STORAGE_DELETION_KEY) || "{}"
                );
                delete storedDeletions[reviewId];
                localStorage.setItem(
                  LOCAL_STORAGE_DELETION_KEY,
                  JSON.stringify(storedDeletions)
                );

                const storedTimers = JSON.parse(
                  localStorage.getItem(LOCAL_STORAGE_DELETION_TIMERS_KEY) || "{}"
                );
                delete storedTimers[reviewId];
                localStorage.setItem(
                  LOCAL_STORAGE_DELETION_TIMERS_KEY,
                  JSON.stringify(storedTimers)
                );
              })
              .catch((error) => {
                console.error(`Ошибка удаления отзыва ${reviewId}:`, error);
              });

            delete updated[reviewId];
            return updated;
          }

          updated[reviewId] = newRemaining;
          return updated;
        });
      }, 100); // Обновляем каждые 100ms для плавного прогресса

      timerIntervalsRef.current[reviewId] = intervalId;
    });

    // Cleanup: очищаем интервалы для удалённых таймеров
    return () => {
      Object.keys(timerIntervalsRef.current).forEach((reviewId) => {
        if (!deletionTimers[reviewId]) {
          clearInterval(timerIntervalsRef.current[reviewId]);
          delete timerIntervalsRef.current[reviewId];
        }
      });
    };
  }, [deletionTimers]);

  // useEffect для управления таймерами принятия
  useEffect(() => {
    // Восстанавливаем таймеры из localStorage при монтировании
    const storedTimers = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE_TIMERS_KEY) || "{}"
    );
    const now = Date.now();
    const restoredTimers: Record<string, number> = {};

    Object.entries(storedTimers).forEach(([reviewId, endTime]: [string, any]) => {
      const remaining = endTime - now;
      if (remaining > 0) {
        restoredTimers[reviewId] = remaining;
      } else {
        // Время вышло, удаляем из localStorage
        delete storedTimers[reviewId];
      }
    });

    localStorage.setItem(
      LOCAL_STORAGE_ACCEPTANCE_TIMERS_KEY,
      JSON.stringify(storedTimers)
    );

    if (Object.keys(restoredTimers).length > 0) {
      setAcceptanceTimers(restoredTimers);
    }
  }, []);

  // useEffect для управления интервалами таймеров принятия
  useEffect(() => {
    Object.entries(acceptanceTimers).forEach(([reviewId, remaining]) => {
      // Если таймер уже существует, не создаём новый
      if (acceptanceTimerIntervalsRef.current[reviewId]) {
        return;
      }

      // Создаём интервал для этого таймера
      const intervalId = setInterval(() => {
        setAcceptanceTimers((prev) => {
          const updated = { ...prev };
          const newRemaining = (updated[reviewId] || 0) - 100; // Уменьшаем на 100ms

          if (newRemaining <= 0) {
            // Время истекло, выполняем принятие
            clearInterval(acceptanceTimerIntervalsRef.current[reviewId]);
            delete acceptanceTimerIntervalsRef.current[reviewId];

            // Автоматически выполняем принятие
            apiService
              .patch({ url: `/admin/check-review/${reviewId}`, dto: {} })
              .then(() => {
                // Удаляем из UI и localStorage
                setReviews((prevReviews) =>
                  prevReviews.filter((r) => r.reviewId !== reviewId)
                );

                const storedAcceptances = JSON.parse(
                  localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE_KEY) || "{}"
                );
                delete storedAcceptances[reviewId];
                localStorage.setItem(
                  LOCAL_STORAGE_ACCEPTANCE_KEY,
                  JSON.stringify(storedAcceptances)
                );

                const storedTimers = JSON.parse(
                  localStorage.getItem(LOCAL_STORAGE_ACCEPTANCE_TIMERS_KEY) || "{}"
                );
                delete storedTimers[reviewId];
                localStorage.setItem(
                  LOCAL_STORAGE_ACCEPTANCE_TIMERS_KEY,
                  JSON.stringify(storedTimers)
                );
              })
              .catch((error) => {
                console.error(`Ошибка принятия отзыва ${reviewId}:`, error);
              });

            delete updated[reviewId];
            return updated;
          }

          updated[reviewId] = newRemaining;
          return updated;
        });
      }, 100); // Обновляем каждые 100ms для плавного прогресса

      acceptanceTimerIntervalsRef.current[reviewId] = intervalId;
    });

    // Cleanup: очищаем интервалы для удалённых таймеров
    return () => {
      Object.keys(acceptanceTimerIntervalsRef.current).forEach((reviewId) => {
        if (!acceptanceTimers[reviewId]) {
          clearInterval(acceptanceTimerIntervalsRef.current[reviewId]);
          delete acceptanceTimerIntervalsRef.current[reviewId];
        }
      });
    };
  }, [acceptanceTimers]);

  const fetchOrgInfo = async (orgId: string) => {
    try {
      const response = await apiService.get<Organization>({
        url: `/admin/org-info/${orgId}`,
      });

      if (response.status === 200) {
        setSelectedOrg(response.data);
        setIsModalOpen(true);

        // Загружаем объявления организации
        setOrganizationAnnouncements([]);
        setAnnouncementsLoading(true);
        setAnnouncementsError(null);

        try {
          const announcementsResponse = await apiService.get<Announcement[]>({
            url: `/ad/by-org/${orgId}`,
          });
          if (announcementsResponse.status === 200) {
            setOrganizationAnnouncements(announcementsResponse.data);
          } else {
            setAnnouncementsError(
              `Ошибка при загрузке объявлений: ${announcementsResponse.status}`
            );
          }
        } catch (error: any) {
          setAnnouncementsError(
            `Ошибка при загрузке объявлений: ${error.message}`
          );
        } finally {
          setAnnouncementsLoading(false);
        }
      }
    } catch (error) {}
  };

  const fetchTouristInfo = async (userId: string) => {
    try {
      const response = await apiService.get<User>({
        url: `/admin/tourist-info/${userId}`,
      });

      if (response.status === 200) {
        setSelectedTourist(response.data);
        setIsTouristModalOpen(true);
      }
    } catch (error) {}
  };

  const loadMoreReviews = () => {
    setVisibleReviewsCount((prevCount) => prevCount + 20);
  };

  const handleBlockUser = async (orgId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-org/${orgId}`,
        dto: { value: true },
      });
      if (response.status === 200) {
        const orgName = selectedOrg?.name || "Организация";
        showToast(`Организация "${orgName}" успешно заблокирована`, "success");
        setIsModalOpen(false);
      }
    } catch (error) {
      showToast("Ошибка при блокировке организации", "error");
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-org/${userId}`,
        dto: { value: false },
      });
      if (response.status === 200) {
        const orgName = selectedOrg?.name || "Организация";
        showToast(`Организация "${orgName}" успешно разблокирована`, "success");
        setIsModalOpen(false);
      }
    } catch (error) {
      showToast("Ошибка при разблокировке организации", "error");
    }
  };

  const handleBlockTourist = async (userId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-tourist/${userId}`,
        dto: { value: true },
      });
      if (response.status === 200) {
        const touristName = selectedTourist?.fullName || "Турист";
        showToast(`Пользователь "${touristName}" успешно заблокирован`, "success");
        setIsTouristModalOpen(false);
      }
    } catch (error) {
      showToast("Ошибка при блокировке пользователя", "error");
    }
  };

  const handleUnblockTourist = async (userId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-tourist/${userId}`,
        dto: { value: false },
      });
      if (response.status === 200) {
        const touristName = selectedTourist?.fullName || "Турист";
        showToast(`Пользователь "${touristName}" успешно разблокирован`, "success");
        setIsTouristModalOpen(false);
      }
    } catch (error) {
      showToast("Ошибка при разблокировке пользователя", "error");
    }
  };

  return (
    <div className="relative w-full min-h-screen flex">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35 z-[-1]"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 z-[-1]"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <SideNav />
      </div>
      <div className="flex-1 flex flex-col items-center px-2 transition-all duration-300 ease-linear ml-[94px] overflow-x-hidden max-w-full">
        {reviews.length > 0 && (
          <div className="h-[68px] grid grid-cols-[1fr_1fr_332px] w-full border-[2px] border-[#E4E9EA] bg-white font-roboto rounded-b-[16px] min-w-0">
            <div className="border-r pl-[32px] h-full flex items-center">
              <div className="text-left text-[24px] font-normal flex items-center ">
                Отзыв
              </div>
            </div>
            <div className="border-r pl-[32px] h-full flex items-center border-gray-300">
              <div className="text-left text-[24px] font-normal flex items-center self-stretch ">
                Жалобы
              </div>
            </div>
            <div className=" h-full pl-[32px] flex items-center">
              <div className="text-left text-[24px] font-normal flex items-center self-stretch ">
                Действие
              </div>
            </div>
          </div>
        )}
        <div
          className="w-full flex flex-col py-[10px] gap-4 overflow-y-auto admin-scrollbar overflow-x-hidden"
          style={{ maxHeight: "calc(100vh - 68px)" }}
        >
          {isLoading ? (
            <Loader />
          ) : reviews.length > 0 ? (
            <>
              {reviews.slice(0, visibleReviewsCount).map((review) => (
                <div
                  key={review.reviewId}
                  className={`grid grid-cols-[1fr_1fr_332px] max-h-[330px] rounded-[16px] min-w-0 ${
                    review.hint
                      ? review.hint.type === "success"
                        ? "bg-[#59C183]"
                        : "bg-[#FF5959]"
                      : "bg-white"
                  }`}
                >
                  {review.status ? (
                    <div
                      className={`col-span-3 flex flex-col rounded-[16px] px-4 py-3 ${
                        review.status === "deleted"
                          ? "bg-[#FF5959]"
                          : "bg-[#59C183]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 text-white rounded">
                          {review.status === "deleted"
                            ? "Отзыв удаляется"
                            : "Отзыв принимается"}
                        </div>
                        <button
                          onClick={() => handleCancelHint(review.reviewId)}
                          className={`p-2 text-white rounded bg-inherit hover:opacity-80 transition ${
                            review.status === "deleted"
                              ? "bg-[#FF5959]"
                              : "bg-[#59C183]"
                          }`}
                        >
                          Отменить
                        </button>
                      </div>

                      {review.status === "deleted" && deletionTimers[review.reviewId] && (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-xs font-medium">
                              {Math.ceil(
                                deletionTimers[review.reviewId] / 1000
                              )}{" "}
                              сек
                            </span>
                            <span className="text-white text-xs font-medium">
                              {Math.round(
                                (deletionTimers[review.reviewId] /
                                  DELETION_TIMEOUT_MS) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-white h-full rounded-full transition-all duration-100"
                              style={{
                                width: `${Math.max(
                                  0,
                                  (deletionTimers[review.reviewId] /
                                    DELETION_TIMEOUT_MS) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {review.status === "accepted" && acceptanceTimers[review.reviewId] && (
                        <div className="w-full">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-xs font-medium">
                              {Math.ceil(
                                acceptanceTimers[review.reviewId] / 1000
                              )}{" "}
                              сек
                            </span>
                            <span className="text-white text-xs font-medium">
                              {Math.round(
                                (acceptanceTimers[review.reviewId] /
                                  ACCEPTANCE_TIMEOUT_MS) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-white h-full rounded-full transition-all duration-100"
                              style={{
                                width: `${Math.max(
                                  0,
                                  (acceptanceTimers[review.reviewId] /
                                    ACCEPTANCE_TIMEOUT_MS) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      key={review.id}
                      className="h-full p-[32px] pr-[32px] flex flex-col border-r min-w-[250px] overflow-hidden"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-shrink-0 min-w-0 max-w-[200px]">
                          <p
                            className={`text-sm font-semibold truncate ${
                              !isLoading
                                ? "cursor-pointer text-blue-500"
                                : "text-gray-500 cursor-default"
                            }`}
                            onClick={() => {
                              if (!isLoading && review && review.userId) {
                                fetchTouristInfo(review.userId);
                                fetchTouristInfo(review.user.id);
                              } else if (isLoading) {
                              } else {
                              }
                            }}
                          >
                            {review.username}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {formatDate(review.reviewDate)}
                          </p>
                          <RatingStars rating={review.reviewStars} />
                        </div>

                        <div
                          key={review.adId}
                          className="flex items-center flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            setSelectedAnnouncementId(review.adId);
                            setIsAnnouncementModalOpen(true);
                          }}
                        >
                          <img
                            src={`${BASE_URL}${review.adImage}`}
                            alt="Фото курорта"
                            className="w-[52px] h-[52px] rounded-2xl object-cover flex-shrink-0"
                            onError={(e) =>
                              (e.currentTarget.src = defaultImage)
                            }
                          />
                          <div className="ml-2 min-w-0 max-w-[250px]">
                            <p className="text-sm font-semibold text-gray-700 truncate">
                              {review.adName}
                            </p>
                            <div className="text-[16px] text-black flex items-center">
                              ⭐ {review.adRating} ·{" "}
                              <span className="text-gray-500">
                                &nbsp;{review.adReviewCount} оценок
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-[#000000] mt-2 break-words">
                        {review.reviewText}
                      </p>
                      {review.reviewImages && (
                        <div className="flex gap-2 mt-2">
                          {review.reviewImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={`${BASE_URL}${img}`}
                              alt="Фото отзыва"
                              className="w-[80px] h-[80px] rounded-2xl object-cover"
                              onError={(e) =>
                                (e.currentTarget.src = defaultImage)
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!review.status && (
                    <>
                      <div className="border-r border-gray-300 p-[32px] flex flex-col min-w-[250px] overflow-hidden">
                        <div className="flex items-center gap-3">
                          <img
                            src={`${BASE_URL}${review.orgImage}`}
                            alt="Лого"
                            className="w-[40px] h-[40px] rounded-full object-cover bg-gray-200 flex-shrink-0"
                            onError={(e) =>
                              (e.currentTarget.src = defaultImage)
                            }
                          />

                          <div className="flex-1 min-w-0 w-full">
                            {review.orgName ? (
                              <p
                                className="font-semibold cursor-pointer text-blue-500 truncate"
                                onClick={() =>
                                  fetchOrgInfo(
                                    review.orgId ||
                                      "3db2a1cd-e76f-4144-9f21-3b58f1c72623"
                                  )
                                }
                              >
                                {review.orgName}
                              </p>
                            ) : (
                              <p>Нет данных</p>
                            )}
                            <p className="text-gray-500 text-sm">
                              {formatDate(review.reportData)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-[#000000] mt-2 break-words">
                          {review.reportText}
                        </p>
                      </div>

                      <div className="flex flex-col items-center space-y-3 w-full p-[32px]">
                        <button
                          onClick={() => handleAcceptReview(review.reviewId)}
                          className="bg-[#39B56B] max-w-[400px] w-[268px] h-[54px] rounded-[32px] text-white py-2 text-sm md:text-base hover:opacity-80 cursor-pointer"
                        >
                          Оставить отзыв
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.reviewId)}
                          className="bg-[#FF5959] max-w-[400px] w-[268px] h-[54px] rounded-[32px] text-white px-4 py-2 text-sm md:text-base hover:opacity-80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                          disabled={isDeleteLoading && deleteLoadingId === review.reviewId}
                        >
                          {isDeleteLoading && deleteLoadingId === review.reviewId ? (
                            <>
                              <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Обработка...
                            </>
                          ) : (
                            "Удалить отзыв"
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {visibleReviewsCount < reviews.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={loadMoreReviews}
                    className="bg-[#0A7D9E] text-white px-4 py-2 rounded-lg"
                  >
                    Загрузить еще
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full absolute inset-0 pointer-events-none">
              <div className="flex flex-col items-center bg-white/75 blur-10 justify-center h-[278px] w-[358px] rounded-lg pointer-events-auto">
                <img
                  src={noComp}
                  alt="Нет жалоб"
                  className="w-[150px] h-[150px] mb-4"
                />
                <p className="text-center text-black text-lg">Жалоб пока нет</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && selectedOrg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-[16px] max-h-[90vh] shadow-lg overflow-y-auto admin-scrollbar w-[600px] flex flex-col">
            <div className="flex items-center justify-between w-full">
              <button
                className="h-[44px] w-[44px]"
                onClick={() => setIsModalOpen(false)}
              >
                <img src={Back} alt="Назад" className="w-6 h-6" />
              </button>
              <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] leading-[20px] tracking-[0.4px] text-center flex-grow">
                Организация
              </h2>
              <button
                className="h-[44px] w-[44px]"
                onClick={() => setIsModalOpen(false)}
              >
                <img src={Close} alt="Выход" className="w-full h-full" />
              </button>
            </div>
            <div className="flex justify-center space-x-4">
              <CoveredImage
                width="w-[128px]"
                height="h-[128px]"
                borderRadius="rounded-full"
                imageSrc={`${BASE_URL}${selectedOrg.imgUrl}`}
                errorImage={defaultImage}
              />
            </div>
            <h2 className="font-roboto font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4 truncate px-4">
              {selectedOrg.name || "Не указано"}
            </h2>
            <div className="mt-4">
              <div className="flex items-center border-t border-[#E4E9EA] gap-3 py-4 px-4 min-w-0">
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] text-black truncate w-full">
                    {selectedOrg.website || "Не указано"}
                  </p>
                  <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                    Сайт
                  </strong>
                </div>
              </div>
              <div className="flex items-center border-t border-[#E4E9EA] gap-3 py-4 px-4 min-w-0">
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] truncate w-full">
                    {selectedOrg.phone || "Не указано"}
                  </p>
                  <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                    Телефон
                  </strong>
                </div>
              </div>
              <div className="flex items-center border-t border-[#E4E9EA] gap-3 py-4 px-4 min-w-0">
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] truncate w-full">
                    {selectedOrg.user?.email || "Не указан"}
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
                <p className="text-red-500">{announcementsError}</p>
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
                <p className="text-gray-500">Нет объявлений</p>
              )}
            </div>
            <div className="flex flex-col items-center gap-4 mt-4">
              {!selectedTourist?.isBanned && (
                <div>
                  <button
                    className="bg-white text-[#FF4545] border-[3px] font-medium border-[#FF4545] px-4 py-2 w-[400px] h-[54px] rounded-[32px] z-10"
                    onClick={() => {
                      handleBlockUser(selectedOrg.id);
                    }}
                  >
                    Заблокировать пользователя
                  </button>
                </div>
              )}
              {selectedTourist?.isBanned && (
                <div>
                  <button
                    className="bg-[#39B56B] text-white px-4 py-2 font-medium w-[400px] h-[54px] rounded-[32px] z-10"
                    onClick={() => {
                      handleUnblockUser(selectedOrg.id);
                    }}
                  >
                    Разблокировать
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isTouristModalOpen && selectedTourist && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-[16px] max-h-[90vh] shadow-lg overflow-y-auto admin-scrollbar w-[600px] flex flex-col">
            <div className="flex items-center justify-between w-full">
              <button
                className="h-[44px] w-[44px]"
                onClick={() => setIsTouristModalOpen(false)}
              >
                <img src={Back} alt="Назад" className="w-6 h-6" />
              </button>
              <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] leading-[20px] tracking-[0.4px] text-center flex-grow">
                Турист
              </h2>
              <button
                className="h-[44px] w-[44px]"
                onClick={() => setIsTouristModalOpen(false)}
              >
                <img src={Close} alt="Выход" className="w-full h-full" />
              </button>
            </div>
            <div className="flex justify-center space-x-4">
              <CoveredImage
                width="w-[128px]"
                height="h-[128px]"
                borderRadius="rounded-full"
                imageSrc={`${BASE_URL}${selectedTourist.picture}`}
                errorImage={defaultImage}
              />
            </div>
            <h2 className="font-roboto font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4 truncate px-4">
              {selectedTourist.fullName || "Не указано"}
            </h2>
            <div className="mt-4">
              <div className="flex items-center border-t border-[#E4E9EA] gap-3 py-4 px-4 min-w-0">
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] truncate w-full">
                    {selectedTourist.phoneNumber || "Не указан"}
                  </p>
                  <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                    Телефон
                  </strong>
                </div>
              </div>
              <div className="flex items-center border-t border-[#E4E9EA] gap-3 py-4 px-4 min-w-0">
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] truncate w-full">
                    {selectedTourist.email || "Не указан"}
                  </p>
                  <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                    Email
                  </strong>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-4">
              {selectedTourist.isBanned ? (
                <div>
                  <button
                    className="bg-[#39B56B] text-white px-4 py-2 font-medium w-[400px] h-[54px] rounded-[32px] z-10"
                    onClick={() => {
                      handleUnblockTourist(selectedTourist.id);
                    }}
                  >
                    Разблокировать
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="bg-white text-[#FF4545] border-[3px] font-medium border-[#FF4545] px-4 py-2 w-[400px] h-[54px] rounded-[32px] z-10"
                    onClick={() => {
                      handleBlockTourist(selectedTourist.id);
                    }}
                  >
                    Заблокировать пользователя
                  </button>
                </div>
              )}
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
};

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

export default ComplaintsPage;

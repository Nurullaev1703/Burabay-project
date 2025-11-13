import { FC, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import SearchIcon from "../../../app/icons/search-icon.svg";
import FilterIcon from "../../../app/icons/main/filter.svg";
import ArrowRightIcon from "../../../app/icons/arrow-right.svg";
import { TouristBookingList } from "../model/booking";
import { baseUrl } from "../../../services/api/ServerData";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { formatPrice } from "../../announcements/announcement/Announcement";
import { NavMenuClient } from "../../../shared/ui/NavMenuClient";
import DefaultIcon from "../../../app/icons/abstract-bg.svg";
import ActiveFilterIcon from "../../../app/icons/active-filter.svg";
import React from "react";
import { TabMenu, TabMenuItem } from "../../../shared/ui/TabMenu";
import { Typography } from "../../../shared/ui/Typography";

interface Props {
  ads: TouristBookingList[];
}

type BookingStatus =
  | "в процессе"
  | "отменено"
  | "оплачено"
  | "исполнено"
  | "подтверждено";

const getDateColorByStatus = (status: BookingStatus): string => {
  switch (status) {
    case "отменено":
      return COLORS_TEXT.gray100;
    case "подтверждено":
      return COLORS_TEXT.angularWhiteBlue;
    case "исполнено":
      return COLORS_TEXT.totalBlack;
    case "в процессе":
    default:
      return COLORS_TEXT.blue200;
  }
};

const getStatusColorByStatus = (
  status: BookingStatus,
  isPaid: boolean
): string => {
  switch (status) {
    case "отменено":
      return COLORS_TEXT.red;
    case "исполнено":
      return "text-orange-400";
    case "подтверждено":
      return "text-green-500";
    case "в процессе":
      return isPaid ? COLORS_TEXT.access : COLORS_TEXT.red;
    default:
      return COLORS_TEXT.red;
  }
};

const getStatusText = (
  status: BookingStatus,
  isPaid: boolean,
  t: (key: string) => string
): string => {
  switch (status) {
    case "отменено":
      return t("cancelStatus");
    case "исполнено":
      return t("doneStatus");
    case "подтверждено":
      return t("confirmStatus");
    case "в процессе":
      return isPaid ? t("paid") : t("waiting");
    default:
      return t("waiting");
  }
};

export const BookingPage: FC<Props> = function BookingPage({ ads }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Функция для форматирования даты с учётом "Сегодня" и "Завтра"
  const formatDateHeader = (dateStr: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Парсим дату из строки DD.MM.YYYY или DD.MM.YY
    const parts = dateStr.replace("_", "").split(".");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year =
        parts[2].length === 2
          ? 2000 + parseInt(parts[2], 10)
          : parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) return t("today");
      if (diffDays === 1) return t("tomorrow");
    }

    // Возвращаем дату без года
    return dateStr.replace(/(\d{2}\.\d{2})\.\d{4}/g, "$1").replace("_", "");
  };

  const [imagesSrc, setImagesSrc] = useState<Record<string, string>>(() => {
    const initial = {};
    ads.forEach((ad) => {
      (initial as Record<string, string>)[ad.ads[0].ad_id] =
        baseUrl + ad.ads[0].img;
    });
    return initial;
  });

  /* @ts-ignore */
  const queryParams = new URLSearchParams(location.search);
  const onlinePayment = queryParams.get("onlinePayment") === "true";
  const onSidePayment = queryParams.get("onSidePayment") === "true";
  const inProgress = queryParams.get("inProgress") === "true";
  const confirmed = queryParams.get("confirm") === "true";
  const completed = queryParams.get("done") === "true";
  const canceled = queryParams.get("canceled") === "true";
  const status = queryParams.get("status") || "ACTIVE";

  const isFilterActive =
    onlinePayment ||
    onSidePayment ||
    canceled ||
    inProgress ||
    confirmed ||
    completed;

  // Индекс активного таба: 0 - Активные, 1 - Архив
  const activeIndex = status === "ACTIVE" ? 0 : 1;

  // Мемоизируем данные для вкладок
  const TABS_DATA: TabMenuItem[] = useMemo(
    () => [
      {
        index: 0,
        title: t("active"),
      },
      {
        index: 1,
        title: t("archive"),
      },
    ],
    [t]
  );

  // Обработчик смены вкладки
  const handleTabChange = useCallback(
    (index: number) => {
      const newStatus = index === 0 ? "ACTIVE" : "DONE";
      navigate({
        to: "/booking/tourist",
        search: {
          status: newStatus,
          ...(onlinePayment && { onlinePayment: true }),
          ...(onSidePayment && { onSidePayment: true }),
          ...(inProgress && { inProgress: true }),
          ...(confirmed && { confirm: true }),
          ...(completed && { done: true }),
          // Убираем фильтр "отменено" при переходе на таб "Активные"
          ...(canceled && index !== 0 && { canceled: true }),
        },
      });
    },
    [
      navigate,
      onlinePayment,
      onSidePayment,
      inProgress,
      confirmed,
      completed,
      canceled,
    ]
  );

  const [adsList, _] = useState<TouristBookingList[]>(ads || []);
  const [searchValue, setSearchValue] = useState<string>("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      navigate({
        to: "/booking/tourist",
        search: {
          adName: searchValue,
          status,
        },
      });
    }
  };
  const allAdsFlat = adsList
    .flatMap((category) =>
      category.ads.map((ad) => ({
        ...ad,
        header: category.header, // добавляем header из родителя
      }))
    )
    .filter((ad) => ad.title.toLowerCase().includes(searchValue.toLowerCase()))
    .sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });

  return (
    <section className="bg-almostWhite min-h-screen">
      {/* Фиксированный хедер с поиском и фильтром */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        <div className="flex justify-between items-center text-center gap-3 px-4 bg-white">
          <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
            <img src={SearchIcon} alt="Поиск" />
            <input
              type="text"
              placeholder={t("search")}
              className="flex-grow bg-transparent outline-none text-gray-700"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSearchValue("");
                }}
                className="flex-shrink-0"
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
          <Link
            to="/booking/filter"
            search={{
              onlinePayment: onlinePayment,
              onSidePayment: onSidePayment,
              canceled: canceled,
              status: status,
            }}
          >
            <img
              src={isFilterActive ? ActiveFilterIcon : FilterIcon}
              className="mt-4"
              alt="Фильтр"
            />
          </Link>
        </div>

        {/* Табы */}
        <div className="py-4 px-4 bg-white">
          <TabMenu
            data={TABS_DATA}
            activeIndex={activeIndex}
            onChangeIndex={handleTabChange}
          />
        </div>
      </div>

      {/* Отступ для фиксированного хедера */}
      <div className="h-[140px]"></div>

      {allAdsFlat.length > 0 ? (
        <ul className="px-4 mt-4 mb-32 bg-white rounded-t-2xl pt-4">
          {allAdsFlat.map((ad) => {
            const groupedTimes = ad.times.reduce(
              (acc, time) => {
                if (!time.time) return acc;
                if (acc[time.time]) {
                  acc[time.time].push(time);
                } else {
                  acc[time.time] = [time];
                }
                return acc;
              },
              {} as Record<string, typeof ad.times>
            );
            return (
              <div key={`${ad.ad_id}-${ad.header}`}>
                {Object.entries(groupedTimes).map(([timeKey, times]) => {
                  const isBlocked = ad.isBanned === true;
                  const content = (
                    <>
                      <div className="mb-2">
                        <div className="flex justify-between">
                          <span
                            className={`font-bold ${
                              timeKey.includes("_")
                                ? COLORS_TEXT.red
                                : getDateColorByStatus(
                                    times[0].status as BookingStatus
                                  )
                            }`}
                          >
                            {formatDateHeader(timeKey)}
                          </span>
                        </div>
                      </div>
                      <div>
                        {times.slice().map((time, index) => {
                          const imageSrc = imagesSrc[ad.ad_id] || DefaultIcon;
                          return (
                            <div
                              key={index}
                              className="flex justify-between mt-6 overflow-hidden"
                            >
                              <div className="flex w-full min-w-0 flex-1">
                                <img
                                  src={imageSrc}
                                  onError={() =>
                                    setImagesSrc((prev) => ({
                                      ...prev,
                                      [ad.ad_id]: DefaultIcon,
                                    }))
                                  }
                                  className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
                                />
                                <div className="flex flex-col w-full min-w-0">
                                  <span className="block truncate max-w-[250px]">
                                    {ad.title}
                                  </span>
                                  <div className="flex justify-between w-full gap-2 items-center">
                                    <div className="flex gap-2 items-center">
                                      <span className="text-sm">
                                        {time.paymentType === "online"
                                          ? t("onlinePayment")
                                          : t("onSidePayment")}
                                      </span>
                                      <span
                                        className={`text-sm ${getStatusColorByStatus(
                                          times[0].status as BookingStatus,
                                          time.isPaid
                                        )}`}
                                      >
                                        {getStatusText(
                                          times[0].status as BookingStatus,
                                          time.isPaid,
                                          t
                                        )}
                                      </span>
                                    </div>

                                    <div className="flex items-center">
                                      <span
                                        className={`${COLORS_TEXT.blue200} whitespace-nowrap`}
                                      >
                                        {formatPrice(time.price)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {!isBlocked && (
                                <img
                                  className="min-w-2 ml-2"
                                  src={ArrowRightIcon}
                                  alt="Подробнее"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );

                  return (
                    <li
                      key={`${ad.ad_id}-${timeKey}`}
                      className="py-3 border-b border-[#E4E9EA]"
                    >
                      {isBlocked ? (
                        <div>{content}</div>
                      ) : (
                        <Link
                          to={`/booking/$bookingId/$category`}
                          params={{ bookingId: ad.ad_id, category: ad.header }}
                          search={{ status }}
                        >
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </div>
            );
          })}
        </ul>
      ) : (
        <div className="px-4 mt-4 mb-32 bg-white rounded-t-2xl pt-8 pb-8">
          <Typography size={16} weight={500} align="center" className="mb-2">
            {activeIndex === 0
              ? t("noActiveBookings")
              : t("noArchivedBookings")}
          </Typography>
          {activeIndex === 1 && (
            <Typography weight={400} align="center" color={COLORS_TEXT.gray100}>
              {t("archivedBookingsInfo")}
            </Typography>
          )}
        </div>
      )}
      <NavMenuClient />
    </section>
  );
};

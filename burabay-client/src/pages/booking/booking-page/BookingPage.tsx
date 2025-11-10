import { FC, useCallback, useMemo, useState } from "react";
import { NavMenuOrg } from "../../../shared/ui/NavMenuOrg";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import SearchIcon from "../../../app/icons/search-icon.svg";
import FilterIcon from "../../../app/icons/main/filter.svg";
import ActiveFilterIcon from "../../../app/icons/active-filter.svg";
import ArrowRightIcon from "../../../app/icons/arrow-right.svg";
import { BookingList } from "../model/booking";
import { baseUrl } from "../../../services/api/ServerData";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import DefaultIcon from "../../../app/icons/abstract-bg.svg";
import { TabMenu, TabMenuItem } from "../../../shared/ui/TabMenu";
import { Typography } from "../../../shared/ui/Typography";

interface Props {
  ads: BookingList[];
}

export const BookingPage: FC<Props> = function BookingPage({ ads }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Функция для форматирования даты с учётом "Сегодня" и "Завтра"
  const formatDateHeader = (dateStr: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Парсим дату из строки DD.MM.YYYY
    const parts = dateStr.split(".");
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

    return dateStr;
  };

  /* @ts-ignore */
  const queryParams = new URLSearchParams(location.search);
  const onlinePayment = queryParams.get("onlinePayment") === "true";
  const onSidePayment = queryParams.get("onSidePayment") === "true";
  const canceled = queryParams.get("canceled") === "true";
  const status = queryParams.get("status") || "ACTIVE";
  const isFilterActive = onlinePayment || onSidePayment || canceled;

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
        to: "/booking/business",
        search: {
          status: newStatus,
          ...(onlinePayment && { onlinePayment: true }),
          ...(onSidePayment && { onSidePayment: true }),
          ...(canceled && { canceled: true }),
        },
      });
    },
    [navigate, onlinePayment, onSidePayment, canceled]
  );

  const [imagesSrc, setImagesSrc] = useState<Record<string, string>>(() => {
    const initial = {};
    ads.forEach((ad) => {
      (initial as Record<string, string>)[ad.ads[0].ad_id] =
        baseUrl + ad.ads[0].img;
    });
    return initial;
  });
  const [adsList, _] = useState<BookingList[]>(ads || []);
  const [searchValue, setSearchValue] = useState<string>("");
  const filteredAds = adsList
    .map((category) => ({
      ...category,
      ads: category.ads.filter((ad) =>
        ad.title.toLowerCase().includes(searchValue.toLowerCase())
      ),
    }))
    .filter((category) => category.ads.length > 0);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
    navigate({
      to: "/booking/business",
      search: {
        adName: searchValue,
        status,
      },
    });
  };

  return (
    <section className="bg-almostWhite min-h-screen">
      {/* Фиксированный хедер с поиском и фильтром */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        <div className="flex justify-between items-center text-center gap-3 px-4 bg-white">
          <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
            <img src={SearchIcon} alt="Поиск" />
            <input
              type="search"
              placeholder={t("search")}
              className="flex-grow bg-transparent outline-none text-gray-700"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Link
            to="/booking/filter"
            search={{
              onlinePayment,
              onSidePayment,
              canceled,
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

      {filteredAds.length > 0 ? (
        <ul className="px-4 mt-4 mb-32 bg-white rounded-t-2xl pt-4">
          {filteredAds.map((category, index) => (
            <li key={index} className="flex flex-col mb-8">
              <span
                className={`${COLORS_TEXT.gray100} w-full text-center mb-2 text-sm`}
              >
                {formatDateHeader(category.header)}
              </span>
              <ul>
                {category.ads
                  .slice()
                  .sort((a, b) => {
                    const aDate = new Date(a.createdAt || 0).getTime();
                    const bDate = new Date(b.createdAt || 0).getTime();
                    return bDate - aDate;
                  })
                  .map((ad) => {
                    const imageSrc = imagesSrc[ad.ad_id] || DefaultIcon;
                    return (
                      <div key={`${ad.ad_id}`}>
                        <li className="py-3 border-b border-[#E4E9EA]">
                          <Link
                            className="flex justify-between items-center"
                            to={`/booking/$bookingId/$category`}
                            params={{
                              bookingId: ad.ad_id,
                              category: category.header,
                            }}
                          >
                            <div className="flex">
                              <img
                                src={imageSrc}
                                onError={() =>
                                  setImagesSrc((prev) => ({
                                    ...prev,
                                    [ad.ad_id]: DefaultIcon,
                                  }))
                                }
                                alt={ad.title}
                                className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
                              />
                              <div>
                                <span>{ad.title}</span>
                                <div className="max-w-[300px] truncate">
                                  {ad.times.slice(0, 5).map((time, index) => {
                                    if (!time) return null;
                                    const [timeStr] = time.split("_");
                                    const updatedTime = timeStr.replace(
                                      /(\d{2}\.\d{2})\.\d{4}/g,
                                      "$1"
                                    );

                                    return (
                                      <span
                                        key={index}
                                        className={COLORS_TEXT.blue200}
                                      >
                                        {updatedTime}
                                        {index <
                                          Math.min(5, ad.times.length) - 1 &&
                                          ", "}
                                      </span>
                                    );
                                  })}
                                  {ad.times.length > 5 && " ..."}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span
                                className={`capitalize text-sm ${ad.status === "в процессе" ? COLORS_TEXT.red : ad.status === "отменено" ? COLORS_TEXT.red : ad.status === "подтверждено" ? COLORS_TEXT.access : COLORS_TEXT.blue200}`}
                              >
                                {ad.status === "в процессе"
                                  ? t("waiting")
                                  : ad.status === "отменено"
                                    ? t("cancelStatus")
                                    : ad.status === "подтверждено"
                                      ? t("confirmStatus")
                                      : ""}
                              </span>
                              <img src={ArrowRightIcon} alt="Подробнее" />
                            </div>
                          </Link>
                        </li>
                      </div>
                    );
                  })}
              </ul>
            </li>
          ))}
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

      <NavMenuOrg />
    </section>
  );
};

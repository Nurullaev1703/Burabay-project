  import { FC, useState } from "react";
  import { useTranslation } from "react-i18next";
  import { Link, useLocation } from "@tanstack/react-router";
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
  interface Props {
    ads: TouristBookingList[];
  }

  export const BookingPage: FC<Props> = function BookingPage({ ads }) {
    const { t } = useTranslation();
    const location = useLocation();
    /* @ts-ignore */
    const queryParams = new URLSearchParams(location.search);
    const onlinePayment = queryParams.get("onlinePayment") === "true";
    const onSidePayment = queryParams.get("onSidePayment") === "true";
    const inProgress = queryParams.get("inProgress") === "true";
    const confirmed = queryParams.get("confirm") === "true";
    const completed = queryParams.get("done") === "true";
    const canceled = queryParams.get("canceled") === "true";
    const isFilterActive =
      onlinePayment ||
      onSidePayment ||
      canceled ||
      inProgress ||
      confirmed ||
      completed;
    const [adsList, _] = useState<TouristBookingList[]>(ads || []);
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
    };

    return (
      <section>
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
            to={`/booking/filter?onlinePayment=${onlinePayment}&onSidePayment=${onSidePayment}&canceled=${canceled}`}
          >
            <img
              src={isFilterActive ? ActiveFilterIcon : FilterIcon}
              className="mt-4"
              alt="Фильтр"
            />
          </Link>
        </div>
        <ul className="px-4 mt-4 mb-32">
          {filteredAds.map((category, index) => (
            <li key={index} className="flex flex-col mb-8">
              <span
                className={`${COLORS_TEXT.gray100} w-full text-center mb-2 text-sm`}
              >
                {t(category.header)}
              </span>
              <ul>
                {category.ads.map((ad) => {
                  // Группируем брони по уникальным значениям time
                  const groupedTimes = ad.times.reduce(
                    (acc, time) => {
                      if (!time.time) return acc;

                      // Если time уже есть в аккумуляторе, добавляем бронь в массив
                      if (acc[time.time]) {
                        acc[time.time].push(time);
                      } else {
                        // Иначе создаем новую запись
                        acc[time.time] = [time];
                      }
                      return acc;
                    },
                    {} as Record<string, typeof ad.times>
                  );

                  return (
                    <>
                      {Object.entries(groupedTimes).map(([timeKey, times]) => (
                        <li
                          key={timeKey}
                          className="py-3 border-b border-[#E4E9EA]"
                        >
                          <Link to={`/booking/${ad.ad_id}/${category.header}`}>
                            <div className="mb-2">
                              <div className="flex justify-between">
                                <span
                                  className={`font-bold ${
                                    timeKey.includes("_")
                                      ? COLORS_TEXT.red
                                      : COLORS_TEXT.blue200
                                  } ${
                                    times[0].status === "отменено"
                                      ? COLORS_TEXT.gray100
                                      : times[0].status === "подтверждено"
                                        ? COLORS_TEXT.angularWhiteBlue
                                        : times[0].status === "исполнено"
                                          ? COLORS_TEXT.totalBlack
                                          : ""
                                  }`}
                                >
                                  {timeKey
                                    .replace("_", "")
                                    .replace(/(\d{2}\.\d{2})\.\d{4}/g, "$1")}
                                </span>
                              </div>
                            </div>
                            <div>
                              {times.map((time, index) => {
                                const [imageSrc, setImageSrc] = useState<string>(
                                  baseUrl + ad.img
                                );
                                return (
                                  <div
                                    key={index}
                                    className="flex justify-between mt-6"
                                  >
                                    <div className="flex w-full">
                                      <img
                                        src={imageSrc}
                                        onError={() => setImageSrc(DefaultIcon)}
                                        alt={ad.title}
                                        className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
                                      />
                                      <div className="flex flex-col w-full">
                                        <span className="">
                                          {ad.title}
                                        </span>
                                        <div className="flex justify-between w-full gap-2 items-center">
                                          <div className="flex gap-2 items-baseline">
                                            <span className="text-sm">
                                              {time.paymentType === "online"
                                                ? t("onlinePayment")
                                                : t("onSidePayment")}
                                            </span>
                                            <span
                                              className={`text-sm
                                                ${
                                                  times[0].status === "исполнено"
                                                    ? "text-orange-400"
                                                    : times[0].status === "подтверждено"
                                                      ? "text-green-500"
                                                      : time.isPaid
                                                        ? COLORS_TEXT.access
                                                        : COLORS_TEXT.red
                                                }`}
                                            >
                                              {times[0].status === "исполнено"
                                                ? t("doneStatus") 
                                                : times[0].status ===
                                                    "подтверждено"
                                                  ? t("confirmStatus")
                                                  : time.isPaid
                                                    ? t("paid") 
                                                    : t("waiting")}{" "}
                                            </span>
                                          </div>

                                          <span
                                            className={`${COLORS_TEXT.blue200}`}
                                          >
                                            {formatPrice(time.price)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <img className="min-w-2 ml-2" src={ArrowRightIcon} alt="Подробнее" />
                                  </div>
                                );
                              })}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        <NavMenuClient />
      </section>
    );
  };

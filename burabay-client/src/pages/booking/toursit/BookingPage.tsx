import { FC, useState } from "react";
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
  const isFilterActive =
    onlinePayment ||
    onSidePayment ||
    canceled ||
    inProgress ||
    confirmed ||
    completed;
  const [adsList, _] = useState<TouristBookingList[]>(ads || []);
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      navigate({
        to: "/booking/tourist",
        search: {
          adName: searchValue,
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
              {Object.entries(groupedTimes).map(([timeKey, times]) => (
                <li
                  key={`${ad.ad_id}-${timeKey}`}
                  className="py-3 border-b border-[#E4E9EA]"
                >
                  <Link to={`/booking/${ad.ad_id}/${ad.header}`}>
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
                          {timeKey
                            .replace("_", "")
                            .replace(/(\d{2}\.\d{2})\.\d{4}/g, "$1")}
                        </span>
                      </div>
                    </div>
                    <div>
                      {times.slice().map((time, index) => {
                        const imageSrc = imagesSrc[ad.ad_id] || DefaultIcon;
                        // const [imageSrc, setImageSrc] =
                        //   useState<string>(baseUrl + ad.img);
                        return (
                          <div
                            key={index}
                            className="flex justify-between mt-6"
                          >
                            <div className="flex w-full">
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
                              <div className="flex flex-col w-full">
                                <span className="">{ad.title}</span>
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
                                    <span className={`${COLORS_TEXT.blue200} whitespace-nowrap`}>
                                      {formatPrice(time.price)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <img
                              className="min-w-2 ml-2"
                              src={ArrowRightIcon}
                              alt="Подробнее"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Link>
                </li>
              ))}
            </div>
          );
        })}
      </ul>
      <NavMenuClient />
    </section>
  );
};

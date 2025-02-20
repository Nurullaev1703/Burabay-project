import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import SearchIcon from "../../../app/icons/search-icon.svg";
import FilterIcon from "../../../app/icons/main/filter.svg";
import ArrowBottomIcon from "../../../app/icons/profile/settings/arrow-bottom.svg";
import { BookingPageFilter, TouristBookingList } from "../model/booking";
import { baseUrl } from "../../../services/api/ServerData";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { formatPrice } from "../../announcements/announcement/Announcement";
import { NavMenuClient } from "../../../shared/ui/NavMenuClient";

interface Props {
  ads: TouristBookingList[];
  filters: BookingPageFilter;
}

export const BookingPage: FC<Props> = function BookingPage({ ads, filters }) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredAds = ads
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
          to={`/booking/filter?${new URLSearchParams(
            Object.entries(filters)
              .filter(([_, value]) => value !== undefined) // Убираем undefined
              .reduce(
                (acc, [key, value]) => {
                  acc[key] = String(value); // Преобразуем boolean в строку
                  return acc;
                },
                {} as Record<string, string>
              )
          ).toString()}`}
        >
          <img src={FilterIcon} className="mt-4" alt="Фильтр" />
        </Link>
      </div>

      <ul className="px-4 mt-4">
        {filteredAds.map((category, index) => (
          <li key={index} className="flex flex-col mb-8">
            <span
              className={`${COLORS_TEXT.gray100} w-full text-center mb-2 text-sm`}
            >
              {t(category.header)}
            </span>
            <ul>
              {category.ads.map((ad) => (
                <>
                  {ad.times.map((time) => (
                    <li
                      key={ad.ad_id}
                      className="py-3 border-b border-[#E4E9EA]"
                    >
                      <Link to={`/booking/${ad.ad_id}/${category.header}`}>
                        <div className="mb-2">
                          {ad.times.slice(0, 5).map((time, index) => {
                            if (!time.time) return null;

                            const hasUnderscore = time.time.includes("_");
                            const formattedTime = time.time.replace("_", "");
                            const updatedTime = formattedTime.replace(
                              /(\d{2}\.\d{2})\.\d{4}/g,
                              "$1"
                            );

                            return (
                              <div className="flex justify-between">
                                <span
                                  key={index}
                                  className={`font-bold ${
                                    hasUnderscore
                                      ? COLORS_TEXT.red
                                      : COLORS_TEXT.blue200
                                  } ${time.status === "отменено" ? COLORS_TEXT.gray100 : ""}`}
                                >
                                  {updatedTime}
                                  {index < Math.min(5, ad.times.length) - 1 &&
                                    ", "}
                                </span>
                                <span
                                  className={`${COLORS_TEXT.red} font-bold`}
                                >
                                  {time.status === "отменено"
                                    ? t("cancelStatus")
                                    : ""}
                                </span>
                              </div>
                            );
                          })}
                          {ad.times.length > 5 && " ..."}
                        </div>
                        <div className="flex justify-between">
                          <div className="flex">
                            <img
                              src={baseUrl + ad.img}
                              alt={ad.title}
                              className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
                            />
                            <div className="flex flex-col">
                              <span className="max-w-[266px] truncate">
                                {ad.title}
                              </span>
                              <div className="flex justify-between w-full">
                                <div className="mr-8">
                                  <span className="mr-2">
                                    {time.paymentType === "online"
                                      ? t("onlinePayment")
                                      : t("onSidePayment")}
                                  </span>
                                  <span
                                    className={`text-sm ${time.isPaid ? COLORS_TEXT.access : COLORS_TEXT.red}`}
                                  >
                                    {time.isPaid ? t("paid") : t("waiting")}
                                  </span>
                                </div>
                                <span className={`${COLORS_TEXT.blue200}`}>
                                  {formatPrice(time.price)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <img src={ArrowBottomIcon} alt="Подробнее" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <NavMenuClient />
    </section>
  );
};

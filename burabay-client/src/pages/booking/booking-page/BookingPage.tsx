import { FC, useState } from "react";
import { NavMenuOrg } from "../../../shared/ui/NavMenuOrg";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "@tanstack/react-router";
import SearchIcon from "../../../app/icons/search-icon.svg";
import FilterIcon from "../../../app/icons/main/filter.svg";
import ActiveFilterIcon from "../../../app/icons/active-filter.svg";
import ArrowRightIcon from "../../../app/icons/arrow-right.svg";
import { BookingList } from "../model/booking";
import { baseUrl } from "../../../services/api/ServerData";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import DefaultIcon from "../../../app/icons/abstract-bg.svg";
interface Props {
  ads: BookingList[];
}

export const BookingPage: FC<Props> = function BookingPage({ ads }) {
  const { t } = useTranslation();
  const location = useLocation();

  /* @ts-ignore */
  const queryParams = new URLSearchParams(location.search);
  const onlinePayment = queryParams.get("onlinePayment") === "true";
  const onSidePayment = queryParams.get("onSidePayment") === "true";
  const canceled = queryParams.get("canceled") === "true";
  const isFilterActive = onlinePayment || onSidePayment || canceled;

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
      event.preventDefault(); // Предотвращаем стандартное поведение
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
              {category.ads
                .slice()
                .sort((a, b) => {
                  const aTime = new Date(a.times[0] || "").getTime();
                  const bTime = new Date(b.times[0] || "").getTime();
                  if (aTime !== bTime) {
                    return bTime - aTime;
                  }
                  const aInProgress = a.times.some(t => t === "в процессе");
                  const bInProgress = b.times.some(t => t === "в процессе");
                  if (aInProgress && !bInProgress) return -1;
                  if (!bInProgress && aInProgress) return 1;
                  
                  return 0;
                })
                .map((ad) => {
                  const [imageSrc, setImageSrc] = useState<string>(
                    baseUrl + ad.img
                  );
                  return (
                    <li className="py-3 border-b border-[#E4E9EA]">
                      <Link
                        className="flex justify-between items-center"
                        to={`/booking/${ad.ad_id}/${category.header}`}
                      >
                        <div className="flex">
                          <img
                            src={imageSrc}
                            onError={() => setImageSrc(DefaultIcon)}
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
                                  <div className="flex">
                                  <span key={index} className={COLORS_TEXT.blue200}>
                                    {updatedTime}
                                    {index < Math.min(5, ad.times.length) - 1 && ", "}
                                  </span>

                                  </div>
                                );
                              })}
                              {ad.times.length > 5 && " ..."}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                        <span className={`capitalize text-sm ${ad.status === "в процессе" ? COLORS_TEXT.red : ad.status === "отменено" ? COLORS_TEXT.red : ad.status === "подтверждено" ? COLORS_TEXT.access : COLORS_TEXT.blue200}`}>
                          {ad.status === "в процессе" ? t("waiting") : ad.status === "отменено" ? t("cancelStatus") : ad.status === "подтверждено" ? t("confirmStatus") : ""}
                        </span>
                          <img src={ArrowRightIcon} alt="Подробнее" />
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </li>
        ))}
      </ul>

      <NavMenuOrg />
    </section>
  );
};

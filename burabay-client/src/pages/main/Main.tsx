import { FC, useCallback, useRef, useState } from "react";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg";
import locationImg from "../../app/icons/main/location.png";
import investirovanie from "../../app/icons/main/investirovanie.png";
import { Category } from "../announcements/model/announcements";
import { baseUrl } from "../../services/api/ServerData";
import { AdCard } from "./ui/AdCard";
import { MapFilter } from "../announcements/announcements-utils";
import { categoryBgColors, COLORS, COLORS_TEXT } from "../../shared/ui/colors";
import { useNavigate } from "@tanstack/react-router";
import { Typography } from "../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { useGetMainPageAnnouncements } from "./main-utils";
import { RotatingLines } from "react-loader-spinner";
import { IconContainer } from "../../shared/ui/IconContainer";
import BackIcon from "../../app/icons/back-icon.svg";

interface Props {
  categories: Category[];
  filters: MapFilter;
}

export const Main: FC<Props> = function Main({ categories, filters }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>(filters.adName || "");
  const [activeCategory, setActiveCategory] = useState<Category | null>(
    categories.find((item) => item.name == filters?.category) || null
  );
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращаем стандартное поведение (если нужно)
      navigate({
        to: "/main",
        search: {
          ...filters,
          adName: searchValue,
        },
      });
    }
  };
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMainPageAnnouncements(filters);

  const announcements = data?.pages.flat() || [];

  // Используем useRef для хранения observer
  const observer = useRef<IntersectionObserver | null>(null);

  // Callback для последнего элемента списка
  const lastElementRef = useCallback(
    (node: HTMLLIElement | null) => {
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
  return (
    <section className="overflow-y-scroll bg-almostWhite min-h-screen">
      <div className="flex justify-between items-center text-center px-4 pt-2 pb-1 bg-white">
        {activeCategory && (
          <IconContainer
            align="start"
            action={() => {
              setActiveCategory(null);
              navigate({
                to: "/main",
                search: {
                  ...filters,
                  category: "",
                  adName: "",
                },
              });
            }}
          >
            <img src={BackIcon} alt="" />
          </IconContainer>
        )}
        <div className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
          <img src={SearchIcon} alt="" />
          <input
            type="search"
            placeholder={t("adSearch")}
            className="flex-grow bg-transparent outline-none text-gray-700"
            autoCorrect="true"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              navigate({
                to: "/main",
                search: {
                  ...filters,
                  adName: searchValue,
                },
              });
            }}
          />
        </div>
        {/* <IconContainer align="center">
          <img src={FilterIcon} className="mt-4" alt="" />
        </IconContainer> */}
      </div>

      {/* Отображаем предложения при отсутствии фильтров */}
      {!activeCategory && !filters.adName && (
        <div className="flex gap-4 overflow-x-auto p-4 bg-white">
          <div className=" relative min-w-[200px] h-[120px] rounded-2xl flex items-center justify-center text-white text-center overflow-hidden">
            <img
              src={investirovanie}
              className="absolute top-0 left-0 w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="relative min-w-[200px] h-[120px] bg-green-500 rounded-2xl flex items-center justify-center text-white text-center overflow-hidden">
            <img
              src={locationImg}
              className="absolute top-0 left-0 w-full h-full object-cover"
              alt=""
            />
          </div>
        </div>
      )}

      {/* Отображаем выбранную категорию */}
      {activeCategory && (
        <div
          key={activeCategory.id}
          className="flex items-center justify-between py-4 px-2 w-full bg-white"
        >
          <div className="flex items-center gap-4 w-full">
            <IconContainer align="end">
              <img
                src={baseUrl + activeCategory.imgPath}
                className="w-[34px] h-[34px]"
              />
            </IconContainer>
            <div className="flex items-center w-full">
              <div className="w-full mr-2">
                <Typography size={16} weight={400} className="text-black">
                  {t(activeCategory.name)}
                </Typography>
                <Typography size={14} weight={400} color={COLORS_TEXT.gray100}>
                  {t(activeCategory.description)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Убираем категории, если есть активная */}
      {!activeCategory && (
        <div className="mt-2 flex justify-between items-center flex-wrap text-center p-2 bg-white">
          {categories.map(({ name, imgPath, id }) => (
            <div
              key={id}
              className={`flex flex-col w-1/3 py-2 rounded-xl items-center select-none`}
              onClick={() => {
                setActiveCategory(
                  categories.find((item) => item.name == name) || null
                )
                navigate({
                  to: "/main",
                  search: {
                    ...filters,
                    category: name == filters.category ? "" : name,
                  },
                });
              }}
            >
              <div className={`w-12 h-12 flex items-center justify-center`}>
                <img src={baseUrl + imgPath} className="w-8 h-8" />
              </div>
              <span
                className={`text-sm text-center text-ellipsis overflow-hidden whitespace-nowrap w-20`}
              >
                {t(name)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ANNOUNCEMENTS */}
      {announcements.length > 0 ? (
        <ul className="mt-2 grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-2 mb-navContent bg-white p-4">
          {announcements.map((item) => {
            return (
              <AdCard
                ad={item}
                key={item.id}
                width={announcements.length == 1 ? "w-[48%]" : ""}
                ref={lastElementRef}
              />
            );
          })}
        </ul>
      ) : (
        <div
          className={`rounded-xl mb-navContent ${filters.category ? categoryBgColors[filters.category] : "bg-blue200"} p-4 mx-2 mt-4`}
        >
          <Typography color={COLORS_TEXT.white} align="center">
            {t("noAds")}
          </Typography>
        </div>
      )}

      {/* Индикатор загрузки новых данных */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center my-4">
          <RotatingLines strokeColor={COLORS.blue200} width="48px" />
        </div>
      )}
      <NavMenuClient />
    </section>
  );
};

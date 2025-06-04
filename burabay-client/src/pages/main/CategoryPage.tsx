import { FC, useCallback, useRef, useState } from "react";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg";
import { Category } from "../announcements/model/announcements";
import { baseUrl } from "../../services/api/ServerData";
import { AdCard } from "./ui/AdCard";
import { categoryBgColors, COLORS, COLORS_TEXT } from "../../shared/ui/colors";
import { useNavigate } from "@tanstack/react-router";
import { Typography } from "../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { useGetMainPageAnnouncements } from "./main-utils";
import { RotatingLines } from "react-loader-spinner";
import { IconContainer } from "../../shared/ui/IconContainer";
import BackIcon from "../../app/icons/back-icon.svg";
import FilterIcon from "../../app/icons/main/filter.svg";
import FilterActiveIcon from "../../app/icons/main/filter-active.svg";
import { MainPageFilter } from "./model/mainpage-types";

interface Props {
  category: Category;
  filters: MainPageFilter;
}

export const CategoryPage: FC<Props> = function CategoryPage({ category, filters }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>(filters.adName || "");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      navigate({
        to: "/category/$categoryId",
        params: { categoryId: category.id },
        search: {
          ...filters,
          adName: searchValue,
        },
      });
    }
  };
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMainPageAnnouncements({
      ...filters,
      category: category.name
    });

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
      <div className="flex justify-between items-center text-center px-4 bg-white fixed top-0 left-0 z-[100] w-full py-2">
        <IconContainer
          align="start"
          action={() => {
            navigate({
              to: "/main",
              search: {
                category: "",
                adName: "",
              },
            });
          }}
        >
          <img src={BackIcon} alt="" />
        </IconContainer>
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
                to: "/category/$categoryId",
                params: { categoryId: category.id },
                search: {
                  ...filters,
                  adName: searchValue,
                },
              });
            }}
          />
        </div>
        <IconContainer
          align="center"
          action={() =>
            navigate({
              to: `/main/filter/${category.id}`,
              search: filters,
            })
          }
        >
          <img
            src={
              filters.details ||
              filters.isHighRating ||
              filters.maxPrice ||
              filters.minPrice ||
              filters.subcategories
                ? FilterActiveIcon
                : FilterIcon
            }
            alt=""
          />
        </IconContainer>
      </div>

      {/* Отображаем выбранную категорию */}
      <div
        key={category.id}
        className="flex items-center justify-between py-4 px-2 w-full bg-white mt-14"
      >
        <div className="flex items-center gap-4 w-full">
          <IconContainer align="end">
            <img
              src={baseUrl + category.imgPath}
              className="w-[34px] h-[34px]"
            />
          </IconContainer>
          <div className="flex items-center w-full">
            <div className="w-full mr-2">
              <Typography size={16} weight={400} className="text-black">
                {t(category.name)}
              </Typography>
              <Typography size={14} weight={400} color={COLORS_TEXT.gray100}>
                {t(category.description)}
              </Typography>
            </div>
          </div>
        </div>
      </div>

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
          className={`rounded-xl mb-navContent ${categoryBgColors[category.name] || "bg-blue200"} p-4 mx-2 mt-4`}
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
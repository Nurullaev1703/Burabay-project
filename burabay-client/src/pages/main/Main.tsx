import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg";
import { Category } from "../announcements/model/announcements";
import { baseUrl } from "../../services/api/ServerData";
import { AdCard } from "./ui/AdCard";
import {
  categoryBgColors,
  categoryBorderColors,
  COLORS,
  COLORS_TEXT,
} from "../../shared/ui/colors";
import { useNavigate } from "@tanstack/react-router";
import { Typography } from "../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import {
  useGetMainPageAnnouncements,
  useGetRecommendedAds,
  Banner,
} from "./main-utils";
import { RotatingLines } from "react-loader-spinner";
import { MainPageFilter } from "./model/mainpage-types";
import { apiService } from "../../services/api/ApiService";
import Close from "/Close.png?url";
import ProfileMark from "../../app/icons/profile/profile.svg";
import { format } from "date-fns";
import { TabMenu, TabMenuItem } from "../../shared/ui/TabMenu";
import { Button } from "../../shared/ui/Button";
import { Loader } from "../../components/Loader";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  categories: Category[];
  favouriteCategories: Category[];
  banners: Banner[];
  filters: MainPageFilter;
}

export const Main: FC<Props> = function Main({
  categories,
  filters,
  favouriteCategories,
  banners,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState<string>(filters.adName || "");

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isEditFavourite, setIsEditFavourite] = useState<boolean>(false);
  const [originalFavourites, setOriginalFavourites] =
    useState<Category[]>(favouriteCategories);

  const [selectedFavourite, setSelectedFavourite] =
    useState<Category[]>(favouriteCategories);
  const [isLoading, setIsLoading] = useState(false);

  // Мемоизируем данные для вкладок
  const TABS_DATA: TabMenuItem[] = useMemo(
    () => [
      {
        index: 0,
        title: t("mainPage"),
      },
      {
        index: 1,
        title: t("recomendations"),
      },
    ],
    [t]
  );

  // Оптимизированный обработчик смены вкладки
  const handleTabChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("mainPageScroll");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }

    const handleScroll = () => {
      sessionStorage.setItem("mainPageScroll", window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
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

  const {
    data: recommends,
    fetchNextPage: fetchNextRec,
    hasNextPage: hasNextRec,
    isFetchingNextPage: isFetchindNextRec,
  } = useGetRecommendedAds(filters);

  // Мемоизируем массивы объявлений для избежания пересоздания при каждом рендере
  const announcements = useMemo(() => data?.pages.flat() || [], [data?.pages]);
  const recommendedAds = useMemo(
    () => recommends?.pages.flat() || [],
    [recommends?.pages]
  );

  // Используем useRef для хранения observer
  const observer = useRef<IntersectionObserver | null>(null);
  const observer_recs = useRef<IntersectionObserver | null>(null);

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
  // Callback для последнего элемента списка
  const lastElementRef_recs = useCallback(
    (node: HTMLLIElement | null) => {
      if (isFetchindNextRec) return;
      if (observer_recs.current) observer_recs.current.disconnect();

      observer_recs.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextRec) {
          fetchNextRec();
        }
      });

      if (node) observer_recs.current.observe(node);
    },
    [isFetchindNextRec, hasNextRec, fetchNextRec]
  );

  const addToFavourite = async () => {
    setIsLoading(true);
    try {
      const originalIds = originalFavourites.map((cat) => cat.id);
      const selectedIds = selectedFavourite.map((cat) => cat.id);
      // Categories to add (were not in original, now selected)
      const added = selectedFavourite.filter(
        (cat) => !originalIds.includes(cat.id)
      );
      // Categories to remove (were in original, now not selected)
      const removed = originalFavourites.filter(
        (cat) => !selectedIds.includes(cat.id)
      );
      // Only send requests for changed categories
      for (const cat of [...added, ...removed]) {
        await apiService.patch({
          url: "/category/favorite/" + cat.id,
        });
      }
      setOriginalFavourites([...selectedFavourite]);
      setIsEditFavourite(false);

      // Инвалидируем кэш рекомендаций для полного обновления
      await queryClient.invalidateQueries({
        queryKey: ["recommended-ads"],
      });
      // Также инвалидируем кэш категорий, если нужно обновить список любимых
      await queryClient.invalidateQueries({
        queryKey: ["main-page-categories"],
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (banner: Banner) => {
    // Навигация на страницу просмотра баннера
    navigate({
      to: "/banner/$bannerId",
      params: { bannerId: banner.id },
    });
  };

  // Мемоизируем отсортированные баннеры
  const sortedBanners = useMemo(() => {
    if (!Array.isArray(banners)) return [];
    return banners.slice().sort((a, b) => b.id.localeCompare(a.id));
  }, [banners]);

  return (
    <section className="overflow-y-scroll bg-almostWhite min-h-screen relative pt-12">
      <div className="flex justify-between items-center text-center px-4 bg-white fixed top-0 left-0 z-[100] w-full py-2">
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
      </div>

      {/* Отображаем предложения */}
      {banners.length > 0 && (
        <div className="flex gap-4 overflow-x-scroll p-4 bg-white w-full">
          {sortedBanners.map((banner) => {
            return (
              <div key={banner.id}>
                <div
                  className="relative min-w-[200px] h-[120px] rounded-2xl flex items-center justify-center text-white text-center overflow-hidden cursor-pointer"
                  onClick={() => openModal(banner)}
                >
                  <img
                    src={`${baseUrl}${banner.imagePath}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    alt={banner.text}
                  />
                </div>
                <Typography
                  color={COLORS_TEXT.totalBlack}
                  align="left"
                  size={14}
                  className="mt-2 font-semibold line-clamp-2 max-w-[200px]"
                >
                  {banner.title}
                </Typography>
                <Typography
                  color={COLORS_TEXT.gray100}
                  align="left"
                  size={12}
                  className="mt-1"
                >
                  {`${t("beforeDelete")} ${format(banner.deleteDate, "dd.MM.yyyy")}`}
                </Typography>
              </div>
            );
          })}
        </div>
      )}

      {/* Отображаем категории */}
      <div
        className={`mt-2 mb-2 flex justify-between items-center flex-wrap text-center p-2 bg-white ${activeIndex === 0 ? "" : "hidden"}`}
      >
        {categories.map(({ name, imgPath, id }) => (
          <div
            key={id}
            className={`flex flex-col w-1/3 py-2 rounded-xl items-center select-none bg-white active:bg-almostWhite active:bg-opacity-50`}
            onClick={() => {
              navigate({
                to: "/category/$categoryId",
                params: { categoryId: id },
                search: {
                  ...filters,
                  category: name,
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

      {/* Отображение рекомендаций */}
      <div className={`bg-white p-4 my-2 ${activeIndex === 1 ? "" : "hidden"}`}>
        <div className="flex justify-between items-center w-full gap-4 mb-2">
          <Typography
            size={16}
            weight={500}
            className={
              !selectedFavourite.length ? "w-full text-center" : "text-left"
            }
          >
            {isEditFavourite ? t("chooseRec") : t("personalRec")}
          </Typography>
          {!isEditFavourite && selectedFavourite.length > 0 && (
            <button
              className="font-medium text-[14px] text-blue100"
              onClick={() => setIsEditFavourite(!isEditFavourite)}
            >
              {t("change")}
            </button>
          )}
        </div>
        {!isEditFavourite && selectedFavourite.length == 0 && (
          <div className="mb-2" onClick={() => setIsEditFavourite(true)}>
            <div
              className={`w-full bg-gradient-to-r from-[#FFB863] to-[#FF7A2F] rounded-2xl p-3 flex justify-between items-center`}
            >
              <div className="max-w-72 flex flex-col">
                <Typography size={14} weight={600} color={COLORS_TEXT.white}>
                  {t("chooseRec")}
                </Typography>
                <button className="border-white border-2 rounded-lg px-10 w-fit mt-2 text-white font-semibold">
                  {t("choose")}
                </button>
              </div>
              <img className="" src={ProfileMark} />
            </div>
          </div>
        )}
        {!isEditFavourite && selectedFavourite.length > 0 && (
          <div className="mt-2 flex justify-between gap-1 items-center flex-wrap text-center p-2 pb-0 bg-white">
            {selectedFavourite.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col w-[32%] py-2 rounded-xl items-center select-none bg-white active:bg-almostWhite active:bg-opacity-50`}
              >
                <div className={`w-12 h-12 flex items-center justify-center`}>
                  <img src={baseUrl + item.imgPath} className="w-8 h-8" />
                </div>
                <span
                  className={`text-sm text-center text-ellipsis overflow-hidden whitespace-nowrap w-20`}
                >
                  {t(item.name)}
                </span>
              </div>
            ))}
          </div>
        )}
        {isEditFavourite && (
          <div className="mt-2 flex justify-between gap-1 items-center flex-wrap text-center p-2 pb-0 bg-white">
            {categories.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col w-[32%] py-2 rounded-xl items-center select-none bg-white active:bg-almostWhite active:bg-opacity-50 ${selectedFavourite.some((fav) => fav.id == item.id) ? `border ${categoryBorderColors[item.name]}` : "border border-transparent"}`}
                onClick={() => {
                  setSelectedFavourite((prev) => {
                    return prev.some((fav) => fav.id === item.id)
                      ? prev.filter((fav) => fav.id !== item.id)
                      : [...prev, item];
                  });
                }}
              >
                <div className={`w-12 h-12 flex items-center justify-center`}>
                  <img src={baseUrl + item.imgPath} className="w-8 h-8" />
                </div>
                <span
                  className={`text-sm text-center text-ellipsis overflow-hidden whitespace-nowrap w-20`}
                >
                  {t(item.name)}
                </span>
              </div>
            ))}
            <Button className="mt-4" onClick={addToFavourite}>
              {t("accept")}
            </Button>
          </div>
        )}
      </div>

      <div className="py-4 px-4 bg-white">
        <TabMenu
          data={TABS_DATA}
          activeIndex={activeIndex}
          onChangeIndex={handleTabChange}
        />
      </div>

      {/* ANNOUNCEMENTS */}
      <div className={activeIndex === 0 ? "" : "hidden"}>
        {announcements.length > 0 && (
          <ul className="grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-2 mb-navContent bg-white px-4">
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
        )}
        {announcements.length == 0 && (
          <div
            className={`rounded-xl mb-navContent ${filters.category ? categoryBgColors[filters.category] : "bg-blue200"} p-4 mx-2 mt-4`}
          >
            <Typography color={COLORS_TEXT.white} align="center">
              {t("noAds")}
            </Typography>
          </div>
        )}
      </div>

      {/* RECOMMENDATIONS */}
      <div className={activeIndex === 1 ? "" : "hidden"}>
        {recommendedAds.length > 0 && (
          <ul className="grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-2 mb-navContent bg-white px-4">
            {recommendedAds.map((item) => {
              return (
                <AdCard
                  ad={item}
                  key={item.id}
                  width={recommendedAds.length == 1 ? "w-[48%]" : ""}
                  ref={lastElementRef_recs}
                />
              );
            })}
          </ul>
        )}
        {recommendedAds.length == 0 && (
          <div className={`py-16 bg-white mt-4`}>
            <Typography size={18} weight={500} align="center" className="mb-2">
              {t("noRec")}
            </Typography>
            <Typography weight={400} align="center">
              {t("noRecText")}
            </Typography>
          </div>
        )}
      </div>

      {/* Индикатор загрузки новых данных */}
      {isFetchingNextPage ||
        (isFetchindNextRec && (
          <div className="flex justify-center items-center my-4">
            <RotatingLines strokeColor={COLORS.blue200} width="48px" />
          </div>
        ))}
      {isLoading && <Loader />}

      <NavMenuClient />
    </section>
  );
};

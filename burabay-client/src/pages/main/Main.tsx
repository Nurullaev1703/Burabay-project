import { FC, useCallback, useEffect, useRef, useState } from "react";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg";
import locationImg from "../../app/icons/main/location.png";
import investirovanie from "../../app/icons/main/investirovanie.png";
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
import { apiService } from "../../services/api/ApiService";
import Close from "../../../public/Close.png";

interface Props {
  categories: Category[];
  filters: MainPageFilter;
}

interface Banner {
  id: string;
  imagePath: string;
  text: string;
  deleteDate: string;
}

export const Main: FC<Props> = function Main({ categories, filters }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>(filters.adName || "");
  const [activeCategory, setActiveCategory] = useState<Category | null>(
    categories.find((item) => item.name == filters?.category) || null
  );

  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // попытка сброса фильтров при использовании нативных жестов возврата назад
  const handlePopState = () => {
    setActiveCategory(null);
    navigate({
      to: "/main",
      search: {
        category: "",
        adName: filters.adName,
      },
    });
  };
  useEffect(() => {
    if (filters.category) {
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [navigate, filters]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await apiService.get<Banner[]>({
          url: "/main-pages/banners",
        });
        setBanners(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке баннеров:", error);
      }
    };

    fetchBanners();
  }, []);

  const openModal = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBanner(null);
    setIsModalOpen(false);
  };

  return (
    <section className="overflow-y-scroll bg-almostWhite min-h-screen">
      <div className="flex justify-between items-center text-center px-4 bg-white fixed top-0 left-0 z-[100] w-full py-2">
        {activeCategory && (
          <IconContainer
            align="start"
            action={() => {
              setActiveCategory(null);
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
        {activeCategory && (
          <IconContainer
            align="center"
            action={() =>
              navigate({
                to: `/main/filter/${activeCategory.id}`,
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
        )}
      </div>

      {/* Отображаем предложения при отсутствии фильтров */}
      {!activeCategory && !filters.adName && (
        <div className="flex gap-4 overflow-x-scroll p-4 bg-white w-full mt-12">
          {banners
            .slice()
            .sort((a, b) => {
              return b.id.localeCompare(a.id);
            })
            .map((banner) => {
              console.log("Image path:", banner.imagePath);

              return (
                <div
                  key={banner.id}
                  className="relative min-w-[200px] h-[120px] rounded-2xl flex items-center justify-center text-white text-center overflow-hidden cursor-pointer"
                  onClick={() => openModal(banner)}
                >
                  <img
                    src={`${baseUrl}${banner.imagePath}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    alt={banner.text}
                  />
                </div>
              );
            })}
        </div>
      )}

      {isModalOpen && selectedBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-[455px] max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center">
              <div className="flex-grow text-center">
                <p className="text-[#0A7D9E] text-[18px] font-semibold">
                  Баннер
                </p>
              </div>
              <img
                src={Close}
                alt="Закрыть"
                className="w-[44px] h-[44px] cursor-pointer"
                onClick={closeModal}
              />
            </div>

            {/* Контейнер для изображения и текста */}
            <div className="w-full max-w-full">
              <img
                src={`${baseUrl}${selectedBanner.imagePath}`}
                alt={selectedBanner.text}
                className="w-full max-w-full max-h-64 mb-4"
              />
              <p className="text-[18px] p-4 break-words box-border w-full max-w-full">
                {selectedBanner.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Отображаем выбранную категорию */}
      {activeCategory && (
        <div
          key={activeCategory.id}
          className="flex items-center justify-between py-4 px-2 w-full bg-white mt-14"
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
              className={`flex flex-col w-1/3 py-2 rounded-xl items-center select-none bg-white active:bg-almostWhite active:bg-opacity-50`}
              onClick={() => {
                setActiveCategory(
                  categories.find((item) => item.name == name) || null
                );
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

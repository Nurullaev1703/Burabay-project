import { FC, useRef, useCallback, useState, useEffect } from "react";
import { Typography } from "../../shared/ui/Typography";
import { NavMenuOrg } from "../../shared/ui/NavMenuOrg";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SearchIcon from "../../app/icons/search-icon.svg";
import { AdCard } from "../main/ui/AdCard";
import { IconContainer } from "../../shared/ui/IconContainer";
import marker from "../../app/icons/announcements/markerMapBlue.svg";
import {
  MapFilter,
  UseGetOrganizationAnnouncements,
} from "./announcements-utils";
import { RotatingLines } from "react-loader-spinner";
import { COLORS } from "../../shared/ui/colors";
import AddAnnouncementIcon from "../../app/icons/Intersect.png";
import { Loader } from "../../components/Loader";
import { useDebounce } from "../../shared/hooks/useDebounce";

interface Props {
  orgId: string;
  filters?: MapFilter;
}

export const Announcements: FC<Props> = ({ orgId, filters }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>(filters?.adName || "");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    navigate({
      to: "/announcements",
      search: {
        ...filters,
        adName: debouncedSearchValue,
      },
    });
  }, [debouncedSearchValue]);

  // Восстанавливаем скролл при монтировании
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("announcementsPageScroll");
    if (savedScroll) {
      const scrollPosition = parseInt(savedScroll, 10);

      const scrollableElement = document.querySelector(
        ".ios-scrollable-content"
      ) as HTMLElement;
      const targetElement = scrollableElement || window;

      let isRestoring = true;
      const timeouts: NodeJS.Timeout[] = [];

      const setScroll = (pos: number) => {
        if (scrollableElement) {
          scrollableElement.scrollTop = pos;
        } else {
          window.scrollTo(0, pos);
        }
      };

      const protectScroll = () => {
        if (isRestoring) {
          const currentScroll = scrollableElement
            ? scrollableElement.scrollTop
            : window.scrollY;
          if (currentScroll < scrollPosition - 10) {
            setScroll(scrollPosition);
          }
        }
      };

      if (scrollableElement) {
        scrollableElement.addEventListener("scroll", protectScroll, {
          passive: true,
        });
      } else {
        window.addEventListener("scroll", protectScroll, { passive: true });
      }

      timeouts.push(setTimeout(() => setScroll(scrollPosition), 0));
      timeouts.push(setTimeout(() => setScroll(scrollPosition), 50));
      timeouts.push(setTimeout(() => setScroll(scrollPosition), 150));
      timeouts.push(setTimeout(() => setScroll(scrollPosition), 300));
      timeouts.push(
        setTimeout(() => {
          setScroll(scrollPosition);
          isRestoring = false;
          if (scrollableElement) {
            scrollableElement.removeEventListener("scroll", protectScroll);
          } else {
            window.removeEventListener("scroll", protectScroll);
          }
        }, 500)
      );

      return () => {
        isRestoring = false;
        if (scrollableElement) {
          scrollableElement.removeEventListener("scroll", protectScroll);
        } else {
          window.removeEventListener("scroll", protectScroll);
        }
        timeouts.forEach((t) => clearTimeout(t));
      };
    }
  }, []);

  // Сохраняем позицию скролла при каждом скролле
  useEffect(() => {
    const scrollableElement = document.querySelector(
      ".ios-scrollable-content"
    ) as HTMLElement;

    const handleScroll = () => {
      const scrollY = scrollableElement
        ? scrollableElement.scrollTop
        : window.scrollY;
      sessionStorage.setItem("announcementsPageScroll", scrollY.toString());
    };

    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollableElement.removeEventListener("scroll", handleScroll);
      };
    } else {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращаем стандартное поведение (если нужно)
      navigate({
        to: "/announcements",
        search: {
          ...filters,
          adName: searchValue,
        },
      });
    }
  };
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    UseGetOrganizationAnnouncements(orgId, filters);

  const adList = data?.pages.flat() || [];

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
    <div
      className={`min-h-screen px-4 ${adList.length ? "mb-36" : "overflow-y-hidden"}`}
    >
      {(adList.length || filters?.adName) && (
        <div className="flex justify-between items-center text-center fixed top-0 left-0 w-full z-[100] bg-white px-4 py-2">
          <div className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
            <img src={SearchIcon} alt="" />
            <input
              type="text"
              placeholder={t("adSearch")}
              className="flex-grow bg-transparent outline-none text-gray-700"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSearchValue("");
                  navigate({
                    to: "/announcements",
                    search: {
                      ...filters,
                      adName: "",
                    },
                  });
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
          <IconContainer align="end">
            <img
              onClick={() => navigate({ to: "/announcements/mapForAnnoun" })}
              src={marker}
              alt=""
            />
          </IconContainer>
        </div>
      )}
      {!adList.length && !isLoading && (
        <div className="flex justify-center flex-col items-center flex-grow mt-16 py-8">
          <img src={AddAnnouncementIcon} alt="" className="mb-8" />
          {filters?.adName ? (
            <Typography size={18} weight={500}>
              {t("noAds")}
            </Typography>
          ) : (
            <>
              <Typography size={18} weight={500}>
                {t("emptyAd")}
              </Typography>
              <Typography size={16} weight={400} align="center" className="">
                {t("addAd")}
              </Typography>
            </>
          )}
        </div>
      )}

      {adList.length > 0 && (
        <>
          <ul className="mt-[64px] grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-2">
            {adList.map((item, index) => {
              if (index === adList.length - 1) {
                return (
                  <AdCard
                    ad={item}
                    key={item.id}
                    isOrganization
                    ref={lastElementRef}
                    width={adList.length == 1 ? "w-[50%]" : ""}
                    fromAnnouncementsPage={true}
                  />
                );
              }
              return (
                <AdCard
                  ad={item}
                  key={item.id}
                  isOrganization
                  fromAnnouncementsPage={true}
                />
              );
            })}
            {/* Индикатор загрузки новых данных */}
            {isFetchingNextPage && (
              <div className="flex justify-center items-center my-4 h-fit">
                <RotatingLines strokeColor={COLORS.blue200} width="48px" />
              </div>
            )}
          </ul>
        </>
      )}
      {!isLoading && (
        <Button
          className={`${adList.length || filters?.adName ? "fixed bottom-navbar left-4 z-50" : "mx-4 mt-4"}  w-header `}
          onClick={() => navigate({ to: "/announcements/addAnnouncements" })}
        >
          {t("addAdBtn")}
        </Button>
      )}
      {isLoading && <Loader />}
      <NavMenuOrg />
    </div>
  );
};

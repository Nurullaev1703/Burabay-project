import { FC, useRef, useCallback, useState } from "react";
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

interface Props {
  orgId: string;
  filters?: MapFilter;
}

export const Announcements: FC<Props> = ({ orgId, filters }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>(filters?.adName || "");
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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
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
    <div className="min-h-screen px-4 mb-36">
      {(adList.length || filters) && (
        <div className="flex justify-between items-center text-center">
          <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
            <img src={SearchIcon} alt="" />
            <input
              type="search"
              placeholder="Поиск"
              className="flex-grow bg-transparent outline-none text-gray-700"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                navigate({
                  to: "/announcements",
                  search: {
                    ...filters,
                    adName: searchValue,
                  },
                });
              }}
            />
          </div>
          <IconContainer className="mt-4" align="end">
            <img
              onClick={() => navigate({ to: "/announcements/mapForAnnoun" })}
              src={marker}
              alt=""
            />
          </IconContainer>
        </div>
      )}
      {!adList.length && (
        <div className="flex justify-center flex-col items-center flex-grow min-h-screen">
          <Typography size={18} weight={500}>
            {t("emptyAd")}
          </Typography>
          <Typography size={16} weight={400} align="center" className="w-4/5">
            {t("addAd")}
          </Typography>
        </div>
      )}

      {adList.length > 0 && (
        <>
          <ul className="mt-6 grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-2">
            {adList.map((item, index) => {
              if (index === adList.length - 1) {
                return (
                  <AdCard
                    ad={item}
                    key={item.id}
                    isOrganization
                    ref={lastElementRef}
                  />
                );
              }
              return <AdCard ad={item} key={item.id} isOrganization />;
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

      <Button
        className="fixed bottom-navbar left-4 w-header z-50 bg-white"
        onClick={() => navigate({ to: "/announcements/addAnnouncements" })}
      >
        {t("addAdBtn")}
      </Button>

      <NavMenuOrg />
    </div>
  );
};

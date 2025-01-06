import { FC, useState } from "react";
import { Typography } from "../../shared/ui/Typography";
import { NavMenuOrg } from "../../shared/ui/NavMenuOrg";
import { Button } from "../../shared/ui/Button";
import Intersect from "../../app/icons/Intersect.png";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Announcement } from "./model/announcements";
import SearchIcon from "../../app/icons/search-icon.svg";
import { AdCard } from "../main/ui/AdCard";
import { IconContainer } from "../../shared/ui/IconContainer";
import marker from "../../app/icons/announcements/markerMapBlue.svg"
import { MapFilter } from "./announcements-utils";

interface Props {
  announcements: Announcement[];
  filters?: MapFilter
}

export const Announcements: FC<Props> = function Announcements({
  announcements,filters
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>(filters?.adName || "")
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
  return (
    <div className="min-h-screen px-4 mb-32">
      {!announcements.length && (
        <div className="flex justify-center flex-col items-center flex-grow min-h-screen">
          <img src={Intersect} className="w-40 h-40 mb-8" alt="" />
          <div className="flex flex-col justify-center items-center gap-2">
            <Typography size={18} weight={500}>
              {t("emptyAd")}
            </Typography>
            <Typography size={16} weight={400} align="center" className="w-4/5">
              {t("addAd")}
            </Typography>
          </div>
        </div>
      )}
      {announcements.length > 0 && (
        <>
          <div className="flex justify-between items-center text-center ">
            <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
              <img src={SearchIcon} alt="" />
              <input
                type="search"
                placeholder="Поиск"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow bg-transparent outline-none text-gray-700"
              />
            </div>
            <IconContainer className="mt-4" align="end">
              <img
                onClick={() =>
                  navigate({
                    to: "/announcements/mapForAnnoun",
                  })
                }
                src={marker}
                alt=""
              />
            </IconContainer>
          </div>
          <ul className="mt-6 grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-2">
            {announcements.map((item) => {
              return <AdCard ad={item} key={item.id} isOrganization width={ announcements.length == 1 ? "w-[48%]" : ""} />;
            })}
          </ul>
        </>
      )}

      <Button
        className="fixed bottom-16 left-4 w-header z-50"
        onClick={() =>
          navigate({
            to: "/announcements/addAnnouncements",
          })
        }
      >
        {t("addAdBtn")}
      </Button>

      <NavMenuOrg />
    </div>
  );
};

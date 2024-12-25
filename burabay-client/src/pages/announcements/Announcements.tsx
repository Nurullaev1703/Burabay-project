import { FC } from "react";
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

interface Props {
  announcements: Announcement[];
}

export const Announcements: FC<Props> = function Announcements({
  announcements,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-4">
      {!announcements.length && (
        <div className="flex justify-center flex-col items-center flex-grow">
          <img src={Intersect} className="w-40 h-40 mb-8" alt="" />
          <div className="flex flex-col justify-center items-center gap-2">
            <Typography size={18} weight={500}>
              {t("emptyAd")}
            </Typography>
            <Typography size={16} weight={400} align="center">
              {t("addAd")}
            </Typography>
          </div>
        </div>
      )}
      {announcements.length && (
        <>
          <div className="flex justify-between items-center text-center ">
            <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
              <img src={SearchIcon} alt="" />
              <input
                type="text"
                placeholder="Поиск"
                className="flex-grow bg-transparent outline-none text-gray-700"
              />

            </div>
            <IconContainer  className="mt-4" align="end">
                <img onClick={() =>
              navigate({
                to: "/announcements/mapForAnnoun"
              })
            } src={marker} alt="" />
              </IconContainer>
          </div>
          <ul className="mt-6 grid grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))] gap-4 mb-10">
            {announcements.map((item) => {
              return <AdCard ad={item} key={item.id} isOrganization />;
            })}
          </ul>
        </>
      )}

      <Button
        className="fixed bottom-20 left-4 w-header"
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

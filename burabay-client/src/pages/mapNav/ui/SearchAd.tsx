import { FC, useState } from "react";
import { Typography } from "../../../shared/ui/Typography";
import BigSearch from "../../../app/icons/announcements/bigSearch.svg";
import { Announcement } from "../../announcements/model/announcements";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { useNavigate } from "@tanstack/react-router";
import SearchIcon from "../../../app/icons/search-icon.svg";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import BackIcon from "../../../app/icons/back-icon.svg";
import { useTranslation } from "react-i18next";

interface Props {
  announcements: Announcement[];
  currentValue: string;
}

export const SearchAd: FC<Props> = function SearchAd({ announcements , currentValue }) {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const [announcementsName, setAnnouncementsName] = useState<string>(currentValue);
  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(announcementsName.toLowerCase())
  );
  return (
    <div className=" bg-white overflow-y-auto">
      <Header pb="0" className="">
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} />
          </IconContainer>
          <div className="w-full flex items-center  gap-2 bg-gray-100 rounded-full px-2 py-1 shadow-sm">
            <img src={SearchIcon} />
            <input
              autoFocus
              onChange={(e) => setAnnouncementsName(e.target.value)}
              type="search"
              placeholder={`${t("adSearch")}`}
              value={announcementsName}
              className="flex-grow bg-transparent outline-none "
            />
          </div>
        </div>
      </Header>

      {announcementsName.trim() === "" ? (
        <div className="flex justify-center flex-col items-center mt-52">
          <img src={BigSearch} className="" alt="" />
          <Typography size={16} weight={400} color={COLORS_TEXT.gray100}>
            {`${t("searchText")}`}
          </Typography>
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        filteredAnnouncements.map((announcement) => (
          <div
            onClick={() =>
              navigate({
                to: "/mapNav",
                search: {
                  categoryNames: "",
                  adName: announcement.title,
                },
              })
            }
            key={announcement.id}
            className="flex flex-col justify-start mb-2 border-b pb-2 p-4 mx-auto w-header"
          >
            <Typography>{announcement.title}</Typography>
            <Typography size={14} weight={400} color={COLORS_TEXT.gray100}>
              {t(announcement.subcategory?.name)}
            </Typography>
          </div>
        ))
      ) : (
        <Typography
          className="flex items-center justify-center"
          size={16}
          weight={400}
          color={COLORS_TEXT.gray100}
        >
          Ничего не найдено
        </Typography>
      )}
    </div>
  );
};

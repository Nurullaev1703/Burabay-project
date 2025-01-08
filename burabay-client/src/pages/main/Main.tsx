import { FC, useState } from "react";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg";
import locationImg from "../../app/icons/main/location.png";
import investirovanie from "../../app/icons/main/investirovanie.png";
import { Announcement, Category } from "../announcements/model/announcements";
import { baseUrl } from "../../services/api/ServerData";
import { AdCard } from "./ui/AdCard";
import { MapFilter } from "pages/announcements/announcements-utils";
import { categoryBgColors, COLORS_TEXT } from "../../shared/ui/colors";
import { useNavigate } from "@tanstack/react-router";
import { Typography } from "../../shared/ui/Typography";

interface Props {
  announcements: Announcement[];
  categories: Category[];
  filters: MapFilter;
}

export const Main: FC<Props> = function Main({
  announcements,
  categories,
  filters,
}) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>(filters.adName || "");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращаем стандартное поведение (если нужно)
      navigate({
        to: "/main",
        search:{
          ...filters,
          adName: searchValue,
        }
      });
    }
  };
  return (
    <section className="overflow-y-scroll bg-almostWhite min-h-screen">
      <div className="flex justify-between items-center text-center gap-3 px-4 bg-white">
        <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
          <img src={SearchIcon} alt="" />
          <input
            type="search"
            placeholder="Поиск"
            className="flex-grow bg-transparent outline-none text-gray-700"
            autoCorrect="true"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {/* <img src={FilterIcon} className="mt-4" alt="" /> */}
      </div>

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

      <div className="mt-6 flex justify-between items-center flex-wrap text-center p-2 bg-white">
        {categories.map(({ name, imgPath, id }) => (
          <div
            key={id}
            className={`flex flex-col w-1/3 py-2 rounded-xl items-center select-none ${name == filters.category && `${categoryBgColors[name]}`}`}
            onClick={() =>
              navigate({
                to: "/main",
                search: {
                  ...filters,
                  category: name == filters.category ? "" : name,
                },
              })
            }
          >
            <div
              className={`w-12 h-12 flex items-center justify-center ${name == filters.category && `brightness-[300%] mix-blend-screen fill-white`}`}
            >
              <img src={baseUrl + imgPath} className="w-8 h-8" />
            </div>
            <span
              className={`text-sm text-ellipsis overflow-hidden whitespace-nowrap w-20 ${name == filters.category && `text-white`}`}
            >
              {name}
            </span>
          </div>
        ))}
      </div>

      {/* ANNOUNCEMENTS */}
      {announcements.length > 0 && (
        <ul className="mt-2 grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-2 mb-navContent bg-white p-4">
          {announcements.map((item) => {
            return (
              <AdCard
                ad={item}
                key={item.id}
                width={announcements.length == 1 ? "w-[48%]" : ""}
              />
            );
          })}
        </ul>
      )}
      {announcements.length < 1 && (
        <div
          className={`rounded-xl mb-navContent ${filters.category ? categoryBgColors[filters.category] : "bg-blue200"} p-4 mx-2 mt-4`}
        >
          <Typography color={COLORS_TEXT.white} align="center">
            {"Объявлений не найдено"}
          </Typography>
        </div>
      )}
      <NavMenuClient />
    </section>
  );
};

import { FC } from "react";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg";
import locationImg from "../../app/icons/main/location.png";
import investirovanie from "../../app/icons/main/investirovanie.png";
import { Announcement, Category } from "../announcements/model/announcements";
import { baseUrl } from "../../services/api/ServerData";
import { AdCard } from "./ui/AdCard";

interface Props {
  announcements: Announcement[];
  categories: Category[];
}

export const Main: FC<Props> = function Main({ announcements, categories }) {
  return (
    <section className="px-4 overflow-y-auto">
      <div className="flex justify-between items-center text-center gap-3">
        <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
          <img src={SearchIcon} alt="" />
          <input
            type="text"
            placeholder="Поиск"
            className="flex-grow bg-transparent outline-none text-gray-700"
          />
        </div>
        {/* <img src={FilterIcon} className="mt-4" alt="" /> */}
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto">
        <div className=" relative min-w-[200px] h-[120px] rounded-lg flex items-center justify-center text-white text-center px-4">
          <img
            src={investirovanie}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            alt=""
          />
        </div>
        <div className="relative min-w-[200px] h-[120px] bg-green-500 rounded-lg flex items-center justify-center text-white text-center px-4">
          <img
            src={locationImg}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            alt=""
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        {categories.map(({ name, imgPath, id }) => (
          <div key={id} className="flex flex-col items-center ">
            <div className="w-12 h-12 flex items-center justify-center ">
              <img src={baseUrl + imgPath} className="w-8 h-8" />
            </div>
            <span className="text-sm mt-2 text-ellipsis overflow-hidden whitespace-nowrap w-20">
              {name}
            </span>
          </div>
        ))}
      </div>

        {/* ANNOUNCEMENTS */}

      <ul className="mt-6 grid grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))] gap-4 mb-10">
        {announcements.map((item) => {
          return <AdCard ad={item} key={item.id} />;
        })}
      </ul>
      <NavMenuClient />
    </section>
  );
};

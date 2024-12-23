import { FC, useState } from "react";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg";
import FilterIcon from "../../app/icons/main/filter.svg";
import locationImg from "../../app/icons/main/location.png";
import investirovanie from "../../app/icons/main/investirovanie.png";
import { Announcement, Category } from "../announcements/model/announcements";
import { baseUrl } from "../../services/api/ServerData";
import { Typography } from "../../shared/ui/Typography";
import maptracker from "../../app/icons/main/markerMap.png";
import { COLORS_TEXT } from "../../shared/ui/colors";
import DefaultImage from "../../app/icons/abstract-bg.svg";
import StarIcon from "../../app/icons/main/star.svg";
import FavouriteIcon from "../../app/icons/favourite.svg"
import { Carousel } from "../../components/Carousel";

interface Props {
  announcements: Announcement[];
  categories: Category[];
}

export const Main: FC<Props> = function Main({ announcements, categories }) {
  return (
    <section className="px-4 overflow-y-auto">
      <div className="flex justify-between items-center text-center gap-3">
        <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-1 shadow-sm">
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
          const [carouselItem,_] = useState(item.images.map((image,index) =>{
            return {
              imgUrl: baseUrl + image,
              index,
            };
          }))
          return (
            <li
              key={item.id}
              className="rounded-2xl relative overflow-hidden min-w-[160px] max-w-[240px]"
            >
              <Carousel items={carouselItem} />
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 z-20">
                <img
                  src={item?.subcategory?.category?.imgPath || maptracker}
                  alt="category"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="p-1">
                <div className="flex justify-between items-center">
                  <Typography
                    size={18}
                    weight={700}
                    color={COLORS_TEXT.blue200}
                    className="uppercase"
                  >
                    {item.price
                      ? (item.price || 0).toLocaleString("ru-RU") + " ₸"
                      : "Бесплатно"}
                  </Typography>
                  <img src={FavouriteIcon} alt="" />
                </div>
                <Typography size={14} weight={400}>
                  {item.title}
                </Typography>
                <Typography size={12} weight={400} className="h-7 line-clamp-2">
                  {item.description}
                </Typography>
                <div className="flex gap-1 items-center mt-1">
                  <img src={maptracker} alt="" className="w-3" />
                  <Typography
                    size={12}
                    weight={400}
                    className="text-black text-xs"
                  >
                    {item?.address?.address || "Боровое"}
                  </Typography>
                </div>
                <div className="flex items-center mt-1 gap-1">
                  <img src={StarIcon} alt="" className="w-3" />
                  <Typography size={12}>{item.avgRating || 0}</Typography>
                  <div className="w-1 h-1 bg-gray100 mx-1 rounded-full"></div>
                  <Typography size={12} color={COLORS_TEXT.gray100}>
                    {item.reviewCount + ` оценок`}
                  </Typography>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <NavMenuClient />
    </section>
  );
};

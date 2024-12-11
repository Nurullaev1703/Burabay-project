import { FC, useState } from "react";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg"
import FilterIcon from "../../app/icons/main/filter.svg"
import { COLORS, COLORS_BACKGROUND, COLORS_BORDER, COLORS_TEXT } from "../../shared/ui/colors";
import { Typography } from "../../shared/ui/Typography";
import locationImg from "../../app/icons/main/location.png"
import investirovanie from "../../app/icons/main/investirovanie.png"
import attractions from "../../app/icons/main/attractions.svg"
import entertaiment from "../../app/icons/main/entertaiment.svg"
import extreme from "../../app/icons/main/extreme.svg"
import health from "../../app/icons/main/health.svg"
import house from "../../app/icons/main/house.svg"
import nutrition from "../../app/icons/main/nutrition.svg"
import rental from "../../app/icons/main/rental.svg"
import rest from "../../app/icons/main/rest.svg"
import security from "../../app/icons/main/security.svg"
import ellipse from "../../app/icons/main/Ellipse.svg"
import maptracker from "../../app/icons/main/maptracker.svg"
import star from "../../app/icons/main/star.svg"

interface Announcement {
  title: string;
  subtitle: string;
  location: string;
  name: string;
  rating: number;
  reviews: number;
  image: string;
}

interface Props {

}

export const Main: FC<Props> = function Main() {
  const [announcementsName, setAnnouncementsName] = useState<string>("");
  const announcements: Announcement[] = [
    {
      title: "БЕСПЛАТНО",
      subtitle: "Бурабайская чаща",
      location: "Боровое",
      name: "Тропа",
      rating: 4.8,
      reviews: 12,
      image: locationImg,
    },
    {
      title: "120 000₸ в сутки",
      subtitle: " Бурабай отдых",
      name: "Отель",
      location: "Боровое",
      rating: 4.8,
      reviews: 22,
      image: locationImg,
    },
    {
      title: "БЕСПЛАТНО",
      name: "Смотровая площадка",
      subtitle: "Лесной камень",
      location: "Боровое",
      rating: 4.8,
      reviews: 12,
      image: locationImg,
    },
  ];

  const filteredAnnouncements = announcements.filter(
    ({ title, subtitle }) =>
      title.toLowerCase().includes(announcementsName.toLowerCase()) ||
      subtitle.toLowerCase().includes(announcementsName.toLowerCase())
  );

  return (
    <section className="px-4">
        <div className="flex justify-between items-center text-center gap-3">
      <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-1 shadow-sm">
        <img src={SearchIcon} alt="" />
        <input
          type="text"
          placeholder="Поиск"
          value={announcementsName}
          onChange={(e) => setAnnouncementsName(e.target.value)}
          className="flex-grow bg-transparent outline-none text-gray-700"
        />


      </div>
      <img src={FilterIcon} className="mt-4" alt="" />
        </div>

      <div className="mt-4 flex gap-4 overflow-x-auto">
        <div className=" relative min-w-[200px] h-[120px] rounded-lg flex items-center justify-center text-white text-center px-4" >
            <img src={investirovanie} className="absolute inset-0 w-full h-full object-cover rounded-lg" alt="" />
          
        </div>
        <div className="relative min-w-[200px] h-[120px] bg-green-500 rounded-lg flex items-center justify-center text-white text-center px-4">
        <img src={locationImg} className="absolute inset-0 w-full h-full object-cover rounded-lg" alt="" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
  {[
    { title: "Отдых", icon: rest },
    { title: "Жильё", icon: house },
    { title: "Питание", icon: nutrition },
    { title: "Достопримечательность", icon: attractions },
    { title: "Здоровье", icon: health },
    { title: "Развлечения", icon: entertaiment },
    { title: "Экстрим", icon: extreme },
    { title: "Прокат", icon: rental },
    { title: "Безопасность", icon: security },
  ].map(({ title, icon }, index) => (
    <div key={index} className="flex flex-col items-center ">
      <div className="w-12 h-12 flex items-center justify-center ">
        <img src={icon} alt={title} className="w-8 h-8" />
      </div>
      <span className="text-sm mt-2 text-ellipsis overflow-hidden whitespace-nowrap w-20">{title}</span>
    </div>
  ))}
</div>


<div className="mt-6 grid grid-cols-2 gap-4 mb-10">
  {filteredAnnouncements.map(
    ({ title, subtitle, location, rating, reviews, image, name }, index) => (
      <div key={index} className="rounded-2xl relative overflow-hidden">
        <img
        
          src={image}
          alt={subtitle}
          className="w-full h-60 object-cover rounded-b-2xl"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full p-1 z-20">
          <img
            src={rest}
            alt="category"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="p-4">
          <h3 className="text-blue200 font-bold text-sm">{title}</h3>
          <Typography className="mt-1" size={14} weight={400}>
            {name}
          </Typography>
          <Typography size={12} weight={400} className="text-black text-sm mt-1">
            {subtitle}
          </Typography>
          <div className="flex gap-2 items-center mt-1">
            <img src={maptracker} alt="" />
            <Typography size={12} weight={400} className="text-black text-xs">
              {location}
            </Typography>
          </div>
          <div className="flex items-center text-yellow-500 text-xs mt-1">
            <img src={star} className="mr-1" alt="" />
            {rating}{" "}
            <img src={ellipse} className="mx-1" alt="" />{" "}
            <Typography size={12} weight={400} color={COLORS_TEXT.gray100}>
              {reviews} оценок
            </Typography>
          </div>
        </div>
      </div>
    )
  )}
</div>




      <NavMenuClient />
    </section>
  );
};

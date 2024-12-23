import { FC, useState } from "react";
import Slider from "react-slick";
import { COLORS_BACKGROUND } from "../shared/ui/colors";
import DefaultImage from "../app/icons/abstract-bg.svg";
import { baseUrl } from "../services/api/ServerData";

export interface CarouselItem {
  index: number;
  imgUrl: string;
}

interface Props {
  height?: string;
  items: CarouselItem[];
}

export const Carousel: FC<Props> = ({ height = "h-60", items }) => {
  // Если нет изображений, добавляем заглушку
  const displayedItems =
    items.length > 0
      ? items.map((item) => ({
          ...item,
          imgUrl: item.imgUrl.startsWith("http")
            ? item.imgUrl
            : baseUrl + item.imgUrl,
        }))
      : [{ index: 0, imgUrl: DefaultImage }];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  // Отключаем бесконечную прокрутку, если изображение только одно
  const settings = {
    dots: displayedItems.length > 1,
    infinite: displayedItems.length > 1, // Только если больше одной картинки
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    pauseOnFocus: true,
    beforeChange: (_: number, current: number) => setActiveIndex(current),
    customPaging: (i: number) => (
      <div
        className={`${
          i === activeIndex
            ? `w-5 ${COLORS_BACKGROUND.blue200}`
            : `w-2 ${COLORS_BACKGROUND.gray200}`
        } h-2 rounded-full transition-all duration-500`}
      />
    ),
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <div className="mx-auto">
      <Slider {...settings}>
        {displayedItems.map((item) => (
          <div key={item.index}>
            <div
              className={`${height} rounded-button flex items-center justify-center relative`}
            >
              <img
                src={item.imgUrl}
                className="absolute top-0 left-0 object-cover w-full h-full rounded-button"
                onError={(e) => {
                  e.currentTarget.src = DefaultImage; // Устанавливаем заглушку при ошибке загрузки
                }}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

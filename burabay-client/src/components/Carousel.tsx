// @ts-nocheck
import { FC, useEffect, useRef, useState } from "react";
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
  ratio?: string;
  items: CarouselItem[];
  currentItemId?: number
  radius?: string
  hasDelete?: boolean
}

export const Carousel: FC<Props> = ({ height = "h-60", items, ratio = "", currentItemId = 0, radius = "rounded-2xl", hasDelete  }) => {
  // Создаем реф с типом Slider
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    if (sliderRef.current) {
      const slickList = (sliderRef.current as any).innerSlider.list; // Используем any для доступа к внутренним свойствам
      const firstSlide = slickList.querySelector(".slick-slide");

      if (firstSlide) {
        // Устанавливаем высоту slick-list в зависимости от высоты первого слайда
        if (height) {
          slickList.classList.add(height);
        }
        if (ratio) {
          slickList.classList.add(ratio);
        }
      }
    }
  }, []);
  // Если нет изображений, добавляем заглушку
  const displayedItems =
    items.length > 0
      ? items.map((item) => ({
          ...item,
          imgUrl: item.imgUrl.startsWith("http") || hasDelete
            ? item.imgUrl
            : baseUrl + item.imgUrl,
        }))
      : [{ index: 0, imgUrl: DefaultImage }];
  const [activeIndex, setActiveIndex] = useState<number>(currentItemId);
  // Отключаем бесконечную прокрутку, если изображение только одно
  const settings = {
    dots: displayedItems.length > 1,
    infinite: displayedItems.length > 1, // Только если больше одной картинки
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    pauseOnFocus: true,
    initialSlide: currentItemId,
    beforeChange: (_: number, current: number) => setActiveIndex(current),
    customPaging: (i: number) => (
      <div
        className={`${
          i === activeIndex
            ? `w-5 ${COLORS_BACKGROUND.blue200}`
            : `w-2 ${COLORS_BACKGROUND.gray200}`
        } h-2 rounded-full transition-all duration-500 `}
      />
    ),
    dotsClass: "slick-dots custom-dots absolute bottom-0 left-0 h-fit",
  };

  return (
    <Slider
      {...settings}
      className={radius + " overflow-y-hidden"}
      ref={sliderRef}
    >
      {displayedItems.map((item) => (
        <div
          key={item.index}
          className={`${height} ${ratio} w-full flex items-center justify-center relative`}
        >
          <img
            src={item.imgUrl}
            className="absolute top-0 left-0 object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.src = DefaultImage; // Устанавливаем заглушку при ошибке загрузки
            }}
          />
        </div>
      ))}
    </Slider>
  );
};

import { FC, useState } from "react";
import Slider from "react-slick";
import { COLORS_BACKGROUND } from "../shared/ui/colors";
import DefaultImage from "../app/img/default-image.png";

// данные, которые потребуются для формирования карусели
export interface CarouselItem {
  index: number;
  imgUrl: string;
}
// требуемая высота для карусели (желательно vh)
interface Props {
  height?: string;
  items: CarouselItem[];
}

export const Carousel: FC<Props> = function Carousel(props) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const height = props.height || "h-96";
  const { items } = props;
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    beforeChange: (previous: number, current: number) =>
      setActiveIndex(current),
    pauseOnFocus: true,
    customPaging: (i: number) => (
      <div
        className={`
                ${i === activeIndex ? `w-5 ${COLORS_BACKGROUND.main100}` : `w-2 ${COLORS_BACKGROUND.blue300}`}
                h-2 rounded-full transition-all duration-500`}
      />
    ),
    dotsClass: "slick-dots custom-dots",
  };
  return (
    <div className="container mx-auto">
      <Slider {...settings}>
        {items.map((item) => {
          const [imageSrc, setImageSrc] = useState<string>(item.imgUrl);
          return (
            <div key={item.index} className="px-2">
              <div
                className={`${height} rounded-button flex items-center justify-center relative`}
              >
                <img
                  src={imageSrc}
                  alt={`Slide ${item.index}`}
                  className="absolute top-o left-0 object-cover w-full h-full rounded-button"
                  onError={() => setImageSrc(DefaultImage)}
                />
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

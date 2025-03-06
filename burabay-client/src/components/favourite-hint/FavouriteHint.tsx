import { FC, useEffect, useRef, useState } from "react";
import { COLORS_BACKGROUND, COLORS_TEXT } from "../../shared/ui/colors";
import FavouriteIcon from "../../app/icons/announcements/favourite.svg";
import CloseIcon from "../../app/icons/announcements/close-white.svg";
import { useTranslation } from "react-i18next";

export const FavouriteHint: FC = function FavouriteHint() {
  const { t } = useTranslation();
  const notificationNode = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    }, 100);

    return () => clearTimeout(timer); // Очистка таймера при размонтировании
  }, []);

  return (
    <div
      ref={notificationNode}
      className={`${COLORS_BACKGROUND.blue200} flex justify-between items-center p-2.5 rounded-lg absolute w-11/12 left-4 transition-all duration-500 z-40 ${
        isVisible ? "top-20 opacity-100" : "-top-20 opacity-0"
      }`}
    >
      <div className="flex items-center">
        <img src={FavouriteIcon} alt="Избранное" className="brightness-[25]" />
        <span className={`${COLORS_TEXT.white} mx-2`}>
          {t("favouriteNotice")}
        </span>
      </div>
      <img src={CloseIcon} alt="Закрыть" onClick={() => setIsVisible(false)} />
    </div>
  );
};

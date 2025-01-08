import { FC, useRef, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import DefaultImage from "../../../app/icons/announcements/image.svg";
import { Typography } from "../../../shared/ui/Typography";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { useTranslation } from "react-i18next";

interface ImageCardProps {
  id: number;
  index: number;
  src: string; // Превью изображения
  isMain: boolean;
  isLast: boolean; // Указывает, является ли это последняя карточка
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onImageUpload: (files: FileList) => void; // Поддержка нескольких файлов
}

const ImageCard: FC<ImageCardProps> = ({
  id,
  index,
  src,
  isMain,
  isLast,
  moveCard,
  onImageUpload,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string>(src || DefaultImage);
  const [isDragAllowed, setIsDragAllowed] = useState(false); // Управляет активацией перетаскивания
  const holdTimeout = useRef<NodeJS.Timeout | null>(null); // Таймер для удержания

  useEffect(() => {
    setImageSrc(src || DefaultImage);
  }, [src]);
  const {t} = useTranslation()
  const [, drop] = useDrop({
    accept: "image",
    hover(item: { id: number; index: number }) {
      if (!ref.current || isLast) return; // Игнорируем, если это последняя карточка

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex !== hoverIndex) {
        moveCard(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isDragAllowed && !isLast, // Перетаскивание разрешено только при удержании и если не последняя карточка
  });

  const handleTouchStart = () => {
    holdTimeout.current = setTimeout(() => {
      setIsDragAllowed(true); // Активируем перетаскивание после удержания
    }, 300); // Удержание 500 мс
  };

  const handleTouchEnd = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current); // Очищаем таймер, если пользователь отпустил раньше
    }
    setIsDragAllowed(false); // Отключаем перетаскивание
  };

  if (!isLast) drag(drop(ref)); // Подключаем `drag` и `drop`, если это не последняя карточка

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files); // Передаём выбранные файлы в родительский компонент
    }
  };

  return (
    <div
      ref={ref}
      className={`relative w-[90px] pt-[90px] rounded-lg border`}
      style={{
        opacity: isDragging ? 0.75 : 1,
        transform: isDragging ? "scale(0.8)" : "scale(1)",
        transition: "transform 0.2s ease, opacity 0.2s ease",
      }}
      onTouchStart={handleTouchStart} // Начало удержания
      onTouchEnd={handleTouchEnd} // Завершение удержания
    >
      <img
        src={imageSrc}
        alt="Preview"
        className={`absolute top-0 left-0 w-full h-full rounded-lg ${imageSrc == DefaultImage ? "object-contain scale-75" : "object-cover"}`}
      />
      {isMain && imageSrc !== DefaultImage && (
        <div className="absolute bottom-2 left-0 bg-blue200 rounded-r-[4px] px-[8px] py-[2px]">
          <Typography size={10} color={COLORS_TEXT.white}>
            {t("main")}
          </Typography>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        multiple={true}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        style={{ zIndex: 10 }}
      />
    </div>
  );
};

export default ImageCard;

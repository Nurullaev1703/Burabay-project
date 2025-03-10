import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { Typography } from "../../../../shared/ui/Typography";
import { COLORS_BACKGROUND, COLORS_TEXT } from "../../../../shared/ui/colors";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
import CloseIcon from "../../../../app/icons/announcements/reviews/close.svg";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { baseUrl } from "../../../../services/api/ServerData";
import { Announcement } from "../../model/announcements";
import StarIcon from "../../../../app/icons/announcements/star.svg";
import { DefaultForm } from "../../../auth/ui/DefaultForm";
import { Controller, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { apiService } from "../../../../services/api/ApiService";
import { imageService } from "../../../../services/api/ImageService";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import ImageCard from "../../ui/ImageCard";
import { Button } from "../../../../shared/ui/Button";
import FocusedStarIcon from "../../../../app/icons/announcements/reviews/focused-star.svg";
import UnFocusedStarIcon from "../../../../app/icons/announcements/reviews/unfocused-star.svg";
import { queryClient } from "../../../../ini/InitializeApp";

interface ImageData {
  file: File | null; // Файл для выгрузки
  preview: string; // Превью для отображения
  serverPreview: string; // ссылка с сервера на изображение
}

interface FormType {
  adId: string;
  images: string[];
  text: string;
  stars: number;
}

export const AddReview: FC = function AddReview() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { announcement } = location.state as Record<string, Announcement>;
  const [reviewImages, _] = useState([]);
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      adId: announcement.id,
      images: [],
      text: "",
      stars: 0,
    },
  });
  const navigate = useNavigate();

  const MAX_IMAGES = 10;
  const [images, setImages] = useState<ImageData[]>(() => {
    // Массив изображений, пришедших с сервера
    const initialImages =
      reviewImages?.map((item) => ({
        file: null,
        preview: baseUrl + item,
        serverPreview: baseUrl + item,
      })) || [];

    // Если количество изображений меньше MAX_IMAGES, добавляем пустые карточки
    if (initialImages.length < MAX_IMAGES) {
      initialImages.push({ file: null, preview: "", serverPreview: "" });
    }

    return initialImages;
  });

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    setImages((prevImages) =>
      update(prevImages, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevImages[dragIndex]],
        ],
      })
    );
  };

  const convertToJpg = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Canvas context is not available"));
            return;
          }

          // Устанавливаем размеры canvas
          canvas.width = img.width;
          canvas.height = img.height;

          // Рендерим изображение на canvas
          ctx.drawImage(img, 0, 0);

          // Конвертируем canvas в Blob в формате JPEG
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to create blob from canvas"));
                return;
              }

              // Создаём новый файл на основе Blob
              const jpgFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, ".jpg"),
                {
                  type: "image/jpeg",
                }
              );
              resolve(jpgFile);
            },
            "image/jpeg",
            0.9 // Качество от 0 до 1
          );
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = event.target?.result as string;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };
  
  const deleteImageFromServer = async (imageUrl: string) => {
    try {
      await apiService.delete({
        url: "/image",
        dto: { filepath: imageUrl.replace(baseUrl, "") },
      });
      console.log(`✅ Изображение ${imageUrl} удалено с сервера`);
    } catch (error) {
      console.error("❌ Ошибка при удалении изображения:", error);
    }
  };

  const handleImageUpload = async (index: number, files: FileList) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
  
      const oldImage = updatedImages[index];
  
      // Если заменяем загруженное изображение — удаляем его с сервера
      if (oldImage?.file === null && oldImage.preview) {
        deleteImageFromServer(oldImage.preview);
      }
  
      return updatedImages;
    });
  
    const newFiles = Array.from(files).slice(0, MAX_IMAGES);
  
    // Преобразуем файлы в JPEG
    const convertedFiles = await Promise.all(
      newFiles.map((file) => convertToJpg(file))
    );
  
    const newImages = convertedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Локальное превью
      serverPreview: "", // Пока не загружено на сервер
    }));
  
    setImages((prevImages) => {
      let updatedImages = [...prevImages];
  
      // Очищаем старый preview, если заменяем фото
      if (updatedImages[index]?.preview) {
        URL.revokeObjectURL(updatedImages[index].preview);
      }
  
      // Вставляем новые фото в нужное место
      updatedImages.splice(index, 1, ...newImages);
  
      // 🔥 Гарантируем, что есть пустая карточка
      if (updatedImages.length < MAX_IMAGES) {
        updatedImages.push({ file: null, preview: "", serverPreview: "" });
      }
  
      return updatedImages;
    });
  };
  

  // 🔥 Функция загрузки фото на сервер (при нажатии "Продолжить")
  const handleUpload = async () => {
    const formData = new FormData();

    images.forEach((image, index) => {
      if (image.file) {
        formData.append(`image_${index}`, image.file);
      }
    });

    try {
      const response = await imageService.post<{ urls: string[] }>({
        url: "/images/reviews",
        dto: formData,
      });

      if (response.data) {
        setImages((prevImages) =>
          prevImages.map((_img, i) => ({
            file: null, // Файл больше не нужен
            preview: response.data.urls[i], // Меняем blob на серверный URL
            serverPreview: response.data.urls[i], // Сохраняем ссылку с сервера
          }))
        );

        return response.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  // 🔥 Удаление загруженных, но неиспользованных изображений
  const deleteUnusedImages = async () => {
    const uploadedImages = images
      .filter((img) => img.file && img.serverPreview) // Берём только загруженные
      .map((img) => img.serverPreview as string);

    if (uploadedImages.length === 0) return;

    try {
      await apiService.delete({
        url: "/images/ads",
        dto: { images: uploadedImages },
      });
      console.log("🗑️ Удалены неиспользованные фото:", uploadedImages);
    } catch (error) {
      console.error("❌ Ошибка при удалении изображений:", error);
    }
  };

  // ❗️ Вызываем удаление при размонтировании компонента (например, при отмене создания объявления)
  useEffect(() => {
    return () => {
      deleteUnusedImages();
    };
  }, []);

  return (
    <section className="min-h-screen bg-background">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("serviceReview")}
            </Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={CloseIcon} alt="" />
          </IconContainer>
        </div>
      </Header>

      <div className="mx-4 my-2 bg-white py-4 px-3 rounded-lg">
        <div className="flex">
          <img
            src={baseUrl + announcement.images[0]}
            alt={announcement.title}
            className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
          />
          <div>
            <span>{announcement.title}</span>
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <img src={StarIcon} className="w-[16px] mr-1 mb-1" />
                <span className="mr-1">
                  {announcement.avgRating ? announcement.avgRating : 0}
                </span>
              </div>
              <div
                className={`${COLORS_BACKGROUND.gray100} w-1 h-1 rounded-full mr-2`}
              ></div>
              <span className={`mr-1 ${COLORS_TEXT.gray100}`}>
                {announcement.reviewCount ? announcement.reviewCount : 0}{" "}
                {t("grades")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {
          setIsLoading(true);
          const newImages = await handleUpload();
          const response = await apiService.post<string>({
            url: "/review",
            dto: {
              ...form,
              images: newImages,
            },
          });
          if (response.data) {
            await queryClient.refetchQueries({ queryKey: [`/review/ad/${announcement.id}`, `/ad/${announcement.id}`] });
            history.back();
          }
          setIsLoading(false);
        })}
      >
        <div className="mx-4 mb-2 bg-white py-4 px-3 rounded-lg">
          <Controller
            name="stars"
            control={control}
            rules={{
              required: t("requiredField"),
            }}
            render={({ field: { value, onChange } }) => (
              <div className="flex justify-between gap-1 px-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={star <= value ? FocusedStarIcon : UnFocusedStarIcon}
                    alt={`Оценка ${star}`}
                    className="w-11 h-11 cursor-pointer"
                    onClick={() => onChange(star)} // Устанавливаем рейтинг
                  />
                ))}
              </div>
            )}
          />
        </div>

        <div className="mx-4 mb-2 bg-white py-4 px-3 rounded-lg">
          <Controller
            name="text"
            control={control}
            rules={{
              required: t("requiredField"),
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message}
                fullWidth={true}
                label={t("review")}
                variant="outlined"
                placeholder={t("describeImpressions")}
              />
            )}
          />
        </div>

        <div className="mx-4 bg-white py-4 px-3 rounded-lg">
          <Typography
            className="mb-2"
            size={12}
            weight={400}
            color={COLORS_TEXT.gray100}
          >
            {t("picture")}
          </Typography>
          <DndProvider
            backend={TouchBackend}
            options={{
              enableMouseEvents: true,
              enableTouchEvents: true, // Включить/отключить touch-события
              ignoreContextMenu: true,
            }}
          >
            <ul
              id="images"
              className="flex gap-2 items-center w-full overflow-x-auto scrollbar-blue pb-2"
            >
              {images.map((image, index) => (
                <li key={index}>
                  <ImageCard
                    id={index}
                    index={index}
                    src={image.preview}
                    moveCard={moveCard}
                    isLast={index == images.length - 1}
                    onImageUpload={(files) => handleImageUpload(index, files)}
                  />
                </li>
              ))}
            </ul>
          </DndProvider>
          <Typography
            className="mt-2"
            size={14}
            weight={400}
            color={COLORS_TEXT.gray100}
          >
            {t("addPicture")}
          </Typography>
        </div>

        <Button
          className="fixed bottom-6 left-4 w-header mt-8 z-10"
          disabled={!isValid || isLoading}
          loading={isLoading || isSubmitting}
        >
          {t("writeReview")}
        </Button>
      </DefaultForm>
    </section>
  );
};

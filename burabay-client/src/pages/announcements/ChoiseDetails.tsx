import { FC, useEffect, useState } from "react";
import { Announcement, Category, Subcategories } from "./model/announcements";
import { Header } from "../../components/Header";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Typography } from "../../shared/ui/Typography";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { DefaultForm } from "../auth/ui/DefaultForm";
import { Controller, useForm } from "react-hook-form";
import { Switch, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMask, format } from "@react-input/mask";
import { ProgressSteps } from "./ui/ProgressSteps";
import { apiService } from "../../services/api/ApiService";
import { useAuth } from "../../features/auth";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import ImageCard from "./ui/ImageCard";
import { imageService } from "../../services/api/ImageService";
import { baseUrl } from "../../services/api/ServerData";
import { ImageViewModal } from "./reviews/ui/ImageViewModal";

interface ImageData {
  file: File | null; // Файл для выгрузки
  preview: string; // Превью для отображения
  serverPreview: string; // ссылка с сервера на изображение
}

interface Props {
  category: Category;
  subcategory: Subcategories;
  announcement?: Announcement;
}
interface FormType {
  title: string;
  description: string;
  youtubeLink: string;
  phoneNumber: string;
  photo: string;
}

export const ChoiseDetails: FC<Props> = function ChoiseDetails({
  category,
  subcategory,
  announcement,
}) {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    (announcement?.details as Record<string, boolean>) || {}
  );
  // состояния для регулировки модалки с изображениями
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const invalidPhonePrefixes = [
    "200",
    "201",
    "202",
    "203",
    "204",
    "205",
    "206",
    "207",
    "208",
    "209", 
    "333",
    "444",
    "555",
    "666",
    "888",
    "999",
    "000", 
    "123",
    "321",
    "234",
    "432",
    "345",
    "543", 
    "709", 
    "911", 
  ];

  const handleToggle = (item: string) => {
    setToggles((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const phoneMask = {
    mask: "+7 ___ ___-__-__",
    replacement: { _: /\d/ },
    showMask: true,
  };
  const mask = useMask(phoneMask);

  const { t } = useTranslation();
  const [errorMessage, _setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const MAX_IMAGES = 10;
  const [images, setImages] = useState<ImageData[]>(() => {
    // Массив изображений, пришедших с сервера
    const initialImages =
      announcement?.images.map((item) => ({
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
      console.log(`Изображение ${imageUrl} удалено с сервера`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (index: number, files: FileList) => {
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
      const updatedImages = [...prevImages];

      // Очищаем старый preview, если заменяем фото
      if (updatedImages[index]?.preview) {
        URL.revokeObjectURL(updatedImages[index].preview);
      }

      // Вставляем новые фото в нужное место
      updatedImages.splice(index, 1, ...newImages);
      if (updatedImages.length < MAX_IMAGES) {
        updatedImages.push({
          file: null,
          preview: "",
          serverPreview: "",
        });
      }

      return updatedImages;
    });
  };

  const handleUpload = async () => {
    const formData = new FormData();

    images.forEach((image, index) => {
      if (image.file) {
        formData.append(`image_${index}`, image.file);
      }
    });

    try {
      const response = await imageService.post<string[]>({
        url: "/images/ads",
        dto: formData,
      });

      if (response.data) {
        setImages((prevImages) =>
          prevImages.map((_img, i) => ({
            file: null, // Файл больше не нужен
            preview: response.data[i], // Меняем blob на серверный URL
            serverPreview: response.data[i], // Сохраняем ссылку с сервера
          }))
        );

        return response.data;
      }
      return [];
    } catch (error) {
      return [];
    }
  };

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

  // Вызываем удаление при размонтировании компонента (например, при отмене создания объявления)
  useEffect(() => {
    return () => {
      deleteUnusedImages();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      title: announcement?.title || "",
      description: announcement?.description || "",
      phoneNumber: announcement?.phoneNumber
        ? format(announcement?.phoneNumber.replace("+7", ""), phoneMask)
        : "+7 ___ ___-__-__",
      youtubeLink: announcement?.youtubeLink || "",
    },
    mode: "onBlur",
  });
  return (
    <section className="min-h-screen bg-[#F1F2F6]">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer
            align="start"
            action={() => {
              if (announcement) {
                navigate({
                  to: "/announcements/edit/subcategory/$subcatId/$adId",
                  params: {
                    subcatId: announcement?.subcategory?.category?.id,
                    adId: announcement?.id,
                  },
                });
              } else {
                history.back();
              }
            }}
          >
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {announcement ? t("changeAd") : t("newAnnouncemet")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("placeAd")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={async () =>
              navigate({
                to: "/announcements",
              })
            }
          >
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={3} totalSteps={9}></ProgressSteps>
      </Header>
      <div className="px-4">
        <DefaultForm
          onSubmit={handleSubmit(async (form) => {
            setIsLoading(true);
            const newImages = await handleUpload();
            if (announcement) {
              await apiService.patch<string>({
                url: `/ad/${announcement.id}`,
                dto: {
                  ...form,
                  phoneNumber: form.phoneNumber.replace(/[ -]/g, ""),
                  images: [
                    ...images
                      .map((item) => {
                        if (item.serverPreview.replace(baseUrl, "").length) {
                          return item.serverPreview.replace(baseUrl, "");
                        }
                      })
                      .filter((item) => item != null),
                    ...(newImages as string[]),
                  ],
                  details: toggles,
                },
              });
              navigate({
                to: `/map/$adId`,
                params: {
                  adId: announcement.id,
                },
              });
            } else {
              const response = await apiService.post<string>({
                url: "/ad",
                dto: {
                  ...form,
                  organizationId: user?.organization?.id,
                  subcategoryId: subcategory.id,
                  phoneNumber: form.phoneNumber.replace(/[ -]/g, ""),
                  images: newImages,
                  details: toggles,
                },
              });
              if (response.data) {
                navigate({
                  to: `/map/$adId`,
                  params: {
                    adId: response.data,
                  },
                });
              }
            }
            setIsLoading(false);
          })}
          className="mt-2"
        >
          <div className="mb-2">
            <Controller
              name="title"
              control={control}
              rules={{
                required: true,
                maxLength: {
                  value: 40,
                  message: t("maxLengthExceeded", { count: 40 }),
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="mb-2">
                  <TextField
                    {...field}
                    error={Boolean(error?.message)}
                    helperText={error?.message || errorMessage}
                    fullWidth={true}
                    type={"text"}
                    variant="outlined"
                    label={t("title")}
                    inputProps={{ maxLength: 40 }}
                    autoFocus={true}
                    placeholder={t("adName")}
                  />
                  <Typography
                    size={12}
                    weight={400}
                    color={COLORS_TEXT.gray100}
                    className="absolute top-[110px] right-5"
                  >
                    {field.value?.length || 0}/40
                  </Typography>
                </div>
              )}
            />
            <Controller
              name="description"
              control={control}
              rules={{
                required: true,
                maxLength: {
                  value: 300,
                  message: t("maxLengthExceeded", { count: 300 }),
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="mb-2">
                  <TextField
                    {...field}
                    error={Boolean(error?.message)}
                    helperText={error?.message || errorMessage}
                    fullWidth={true}
                    type={"text"}
                    variant="outlined"
                    label={t("description")}
                    inputProps={{ maxLength: 300 }}
                    placeholder={t("adDescription")}
                  />
                  <Typography
                    size={12}
                    weight={400}
                    color={COLORS_TEXT.gray100}
                    className="absolute top-[192px] right-5"
                  >
                    {field.value?.length || 0}/300
                  </Typography>
                </div>
              )}
            />
            <div className="bg-white rounded-lg p-4 mb-2">
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
                        isMain={index == 0}
                        moveCard={moveCard}
                        isLast={index == images.length - 1}
                        onImageUpload={(files) =>
                          handleImageUpload(index, files)
                        }
                        onClick={() => {
                          setImageIndex(index);
                          setImageModal(true);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </DndProvider>
              {imageModal && (
                <ImageViewModal
                  images={images.filter(item => item.preview).map((image, index) => {
                    return {
                      index: index,
                      imgUrl: image.preview,
                    };
                  })}
                  open={imageModal}
                  onClose={() => setImageModal(false)}
                  firstItem={imageIndex}
                  onDelete={() => {
                    if(images[imageIndex].serverPreview) {
                      deleteImageFromServer(images[imageIndex].serverPreview);
                    }
                    setImages((prevImages) =>
                      update(prevImages, {
                        $splice: [[imageIndex, 1]],
                      })
                    );
                    setImageModal(false);
                  }}
                />
              )}
              <Typography
                className="mt-2"
                size={14}
                weight={400}
                color={COLORS_TEXT.gray100}
              >
                {t("addPicture")}
              </Typography>
            </div>
            <Controller
              name="youtubeLink"
              control={control}
              rules={{}}
              render={({ field, fieldState: { error } }) => (
                <div className="mb-2">
                  <TextField
                    {...field}
                    error={Boolean(error?.message)}
                    helperText={error?.message || errorMessage}
                    fullWidth={true}
                    type={"text"}
                    variant="outlined"
                    label={t("youtubeVideo")}
                    inputProps={{ maxLength: 300 }}
                    placeholder={t("inputLink")}
                  />
                </div>
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: t("requiredField"),
                validate: (value: string) => {
                  const cleanedNumber = value.replace(/\D/g, "");
                  if (cleanedNumber.length !== 11) {
                    return t("invalidNumber");
                  }

                  const prefix = cleanedNumber.substring(1, 4);
                  if (invalidPhonePrefixes.includes(prefix)) {
                    return "Такого номера не существует";
                  }

                  return true;
                },
                pattern: {
                  value: /^\+7 \d{3} \d{3}-\d{2}-\d{2}$/,
                  message: "Неверный формат номера телефона",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  fullWidth
                  type="tel"
                  inputMode="tel"
                  label={t("phoneV2")}
                  variant="outlined"
                  inputRef={mask}
                  placeholder="+7 700 000-00-00"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </div>
          <div className="bg-white rounded-lg p-4 mb-navContent">
            <Typography size={16} weight={400} color={COLORS_TEXT.gray100}>
              {t("detailsTitle")}
            </Typography>
            {category.details.map((item) => {
              // FIXME что за type
              return (
                item !== "type" && (
                  <div
                    key={item}
                    className="flex items-center justify-between  border-b py-2 "
                  >
                    <Typography>{t(item)}</Typography>
                    <Switch
                      checked={toggles[item] || false}
                      onChange={() => handleToggle(item)}
                      className={`${
                        toggles[item] ? "" : ""
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    ></Switch>
                  </div>
                )
              );
            })}
          </div>
          <div className="fixed left-0 bottom-2 px-2 w-full z-10">
            <Button
              type="submit"
              disabled={!isValid || isLoading}
              loading={isLoading || isSubmitting}
              mode="default"
            >
              {t("continue")}
            </Button>
          </div>
        </DefaultForm>
      </div>
    </section>
  );
};

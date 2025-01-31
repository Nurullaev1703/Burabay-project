import { FC, useState } from "react";
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
import { useMask } from "@react-input/mask";
import { ProgressSteps } from "./ui/ProgressSteps";
import { apiService } from "../../services/api/ApiService";
import { useAuth } from "../../features/auth";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import ImageCard from "./ui/ImageCard";
import { imageService } from "../../services/api/ImageService";

interface ImageData {
  file: File | null; // Файл для выгрузки
  preview: string; // Превью для отображения
}

interface Props {
  category: Category;
  subcategory: Subcategories;
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
}) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const handleToggle = (item: string) => {
    setToggles((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mask = useMask({
    mask: "+7 ___ ___-__-__",
    replacement: { _: /\d/ },
    showMask: true,
  });
  const { t } = useTranslation();
  const [errorMessage, _setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [images, setImages] = useState<ImageData[]>([
    { file: null, preview: "" },
  ]);
  const MAX_IMAGES = 10;

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

  const handleImageUpload = async (index: number, files: FileList) => {
    const newFiles = Array.from(files).slice(0, MAX_IMAGES - images.length);

    // Преобразуем файлы в формат JPEG
    const convertedFiles = await Promise.all(
      newFiles.map((file) => convertToJpg(file))
    );

    const newImages = convertedFiles.map((file) => {
      const preview = URL.createObjectURL(file);
      return { file, preview };
    });

    setImages((prevImages) => {
      // Очищаем старые preview
      prevImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });

      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1, ...newImages);

      if (updatedImages.length < MAX_IMAGES) {
        updatedImages.push({ file: null, preview: "" });
      }

      return updatedImages.slice(0, MAX_IMAGES);
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
      if (response.data && response.status) {
        return response.data;
      } else {
        throw new Error("Ошибка при загрузке файлов.");
      }
    } catch {
      throw new Error("Ошибка при загрузке файлов.");
    }
  };

  if (images.length === 0) {
    setImages([{ file: null, preview: "" }]);
  }
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      description: "",
    },
    mode: "onSubmit",
  });
  return (
    <section className="min-h-screen bg-[#F1F2F6]">
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
              {t("newAnnouncemet")}
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
            const response = await apiService.post<Announcement>({
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
            if (response.data.id) {
              navigate({
                to: `/map/$adId`,
                params: {
                  adId: response.data.id,
                },
              });
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
                  const phoneRegex = /^\+7 \d{3} \d{3}-\d{2}-\d{2}$/;
                  return phoneRegex.test(value) || t("invalidNumber");
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
              return item !== "type" && (
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

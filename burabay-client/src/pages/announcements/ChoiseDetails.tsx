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
import { Modal, Switch, TextField } from "@mui/material";
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
import VideoUploadImg from "../../app/icons/profile/confirm/file.svg"

interface ImageData {
  file: File | null; // Файл для выгрузки
  preview: string; // Превью для отображения
  serverPreview: string;
   // ссылка с сервера на изображение
}

interface VideoData {
  file: File | null;
  preview: string;
  duration: number;
  size: number;
  serverPath: string; // Добавляем поле для хранения пути на сервере
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
}

export const ChoiseDetails: FC<Props> = function ChoiseDetails({
  category,
  subcategory,
  announcement,
}) {
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
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
    showMaskOnHover: false,
    showMaskOnBlur: false,
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
    } catch (error) {
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
    } catch (error) {
    }
  };

  useEffect(() => {
    return () => {
      deleteUnusedImages();
    };
  }, []);
  const [title, setTitle] = useState<string>(announcement?.title || "");
  const [description, setDescription] = useState<string>(
    announcement?.description || ""
  );
  const [youtubeLink, _setYoutubeLink] = useState<string>(
    announcement?.youtubeLink || ""
  );
  const [video, setVideo] = useState<VideoData | null>(() => {
    if (announcement?.video) {
      return {
        preview: baseUrl + announcement.video,
        file: null,
        duration: 0,
        size: 0,
        serverPath: baseUrl + announcement.video // Используем baseUrl как в images
      };
    }
    return null;
  });
  const [videoError, setVideoError] = useState<string>("");
  const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB в байтах
  const MAX_VIDEO_DURATION = 90; // 1.5 минуты в секундах
  
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
    watch,
  } = useForm<FormType>({
    defaultValues: {
      title: title,
      description: description,
      phoneNumber: announcement?.phoneNumber
        ? format(announcement?.phoneNumber.replace("+7", ""), phoneMask)
        : "",
      youtubeLink: youtubeLink,
    },
    mode: "onChange",
  });
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");
  useEffect(() => {
    setTitle(watchedTitle);
  }, [watchedTitle]);

  useEffect(() => {
    setDescription(watchedDescription);
  }, [watchedDescription]);
  
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setVideoError("");
    
    if (!file) return;
    
    if (file.size > MAX_VIDEO_SIZE) {
      setVideoError(t("videoSizeExceeded", { size: "200МБ" }) || "Размер видео превышает 200МБ");
      return;
    }
    
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    
    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoElement.src);
      
      if (videoElement.duration > MAX_VIDEO_DURATION) {
        setVideoError(t("videoDurationExceeded", { duration: "1.5" }) || "Длительность видео превышает 1.5 минуты");
        return;
      }
      
      setVideo(prev => ({
        file,
        preview: URL.createObjectURL(file),
        duration: videoElement.duration,
        size: file.size,
        serverPath: prev?.serverPath || '' // Сохраняем существующий путь
      }));
    };
    
    videoElement.onerror = () => {
      setVideoError(t("invalidVideoFormat") || "Неверный формат видео");
    };
    
    videoElement.src = URL.createObjectURL(file);
  };
  
  const uploadVideo = async (): Promise<string | null> => {
    if (!video?.file) {
      // Если файл не изменился, возвращаем существующий путь без baseUrl
      return video?.serverPath ? video.serverPath.replace(baseUrl, '') : null;
    }
    
    const formData = new FormData();
    formData.append('file', video.file);
    
    try {
      const response = await imageService.post<string>({
        url: "/video",
        dto: formData,
      });
      
      // Обновляем состояние с новым серверным путем, добавляя baseUrl
      setVideo(prev => prev ? {
        ...prev,
        serverPath: baseUrl + response.data
      } : null);
      
      return response.data; // Возвращаем путь без baseUrl для API
    } catch (error) {
      return null;
    }
  };
  
  const handleConfirmPublish = async () => {
    setIsLoading(true);
    const newImages = await handleUpload();
    const video = await uploadVideo();

    try {
      const phoneNumberDto = mask.current?.value.replace(/[ -]/g, "") ? {
        phoneNumber: mask.current?.value.replace(/[ -]/g, ""),
      } : null
      const response = await apiService.post<string>({
        url: "/ad",
        dto: {
          title,
          description,
          youtubeLink,
          video,
          organizationId: user?.organization?.id,
          subcategoryId: subcategory.id,
          images: newImages,
          details: toggles,
          ...phoneNumberDto
        },
      });

      if (response.data) {
        navigate({ to: "/announcements" });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };
  const handleValidatePhone = (value: string) => {
    if (value.replace(/[^\d]/g, "").replace("7", "").length !== 0) {
      const cleanedNumber = value.replace(/[^\d]/g, "");
      if (cleanedNumber.length !== 11) {
        return false;
      }

      const prefix = cleanedNumber.substring(1, 4);
      if (invalidPhonePrefixes.includes(prefix)) {
        return false;
      }
    }
    return true;
  };
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
          <IconContainer align="end" action={() => setShowModal(true)}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={3} totalSteps={9}></ProgressSteps>
      </Header>
      {showModal && (
        <Modal
          className="flex w-full h-full justify-center items-center p-4"
          open={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="relative w-full flex flex-col bg-white p-4 rounded-lg">
            <Typography size={16} weight={400} className="text-center">
              {t("confirmDelete")}
            </Typography>
            <div
              onClick={() => setShowModal(false)}
              className="absolute right-[-2px] top-[-2px] p-4"
            >
              <img src={XIcon} className="w-[15px]" alt="" />
            </div>
            <div className="flex flex-col w-full px-4 justify-center mt-4">
              <Button className="mb-2" onClick={handleConfirmPublish}>
                {t("publish")}
              </Button>
              <Button
                mode="red"
                className="border-2 border-red"
                onClick={async () => {
                  await apiService.delete({
                    url: `/ad/${announcement?.id}`,
                  });
                  navigate({
                    to: "/announcements",
                  });
                }}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="px-4">
        <DefaultForm
          onSubmit={handleSubmit(async (form) => {
            setIsLoading(true);
            const newImages = await handleUpload();
            const videoPath = await uploadVideo();
            
            if (announcement) {
              const phoneNumberDto = mask.current?.value.replace(/\D/g, "").replace("7", "")
                ? {
                  phoneNumber: "+"+mask.current?.value.replace(/\D/g, "")
                  }
                : null;
              await apiService.patch<string>({
                url: `/ad/${announcement.id}`,
                dto: {
                  title: form.title,
                  description: form.description,
                  youtubeLink: form.youtubeLink,
                  video: videoPath,
                  organizationId: user?.organization?.id,
                  subcategoryId: subcategory.id,
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
                  ...phoneNumberDto,
                },
              });
              navigate({
                to: `/map/$adId`,
                params: {
                  adId: announcement.id,
                },
              });
            } else {
              const phoneNumberDto = mask.current?.value.replace(/[ -]/g, "")
                ? {
                    phoneNumber: mask.current?.value.replace(/[ -]/g, ""),
                  }
                : null;
              const response = await apiService.post<string>({
                url: "/ad",
                dto: {
                  title: form.title,
                  description: form.description,
                  youtubeLink: form.youtubeLink,
                  video: videoPath,
                  organizationId: user?.organization?.id,
                  subcategoryId: subcategory.id,
                  images: newImages,
                  details: toggles,
                  ...phoneNumberDto,
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
                    value={field.value} // Значение из react-hook-form
                    onChange={(e) => {
                      field.onChange(e); // Обновляем react-hook-form
                    }}
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
                    multiline
                    variant="outlined"
                    label={t("description")}
                    inputProps={{ maxLength: 300 }}
                    placeholder={t("adDescription")}
                    value={field.value} // Значение из react-hook-form
                    onChange={(e) => {
                      field.onChange(e); // Обновляем react-hook-form
                    }}
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
                  images={images
                    .filter((item) => item.preview)
                    .map((image, index) => {
                      return {
                        index: index,
                        imgUrl: image.preview,
                      };
                    })}
                  open={imageModal}
                  onClose={() => setImageModal(false)}
                  firstItem={imageIndex}
                  onDelete={async () => {
                    if (images[imageIndex].serverPreview) {
                      await deleteImageFromServer(images[imageIndex].serverPreview);
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
            <div className="bg-white rounded-lg p-4 mb-2">
              <Typography
                className="mb-2"
                size={12}
                weight={400}
                color={COLORS_TEXT.gray100}
              >
                {t("uploadVideo")}
              </Typography>
              
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label 
                  htmlFor="video-upload" 
                  className="flex items-center  rounded-lg cursor-pointer"
                >
                  <div className="flex gap-4 items-center">
                    <img src={VideoUploadImg} alt="" />
                    <Typography size={14} weight={400} color={COLORS_TEXT.gray100}>
                      {video ? (t("changeVideo")) : (t("selectVideo"))}
                    </Typography>
                  </div>
                </label>
                
                {videoError && (
                  <Typography size={14} weight={400} color={COLORS_TEXT.red}>
                    {videoError}
                  </Typography>
                )}
                
                {video && (
                  <div className="relative">
                    <video 
                      src={video.preview || announcement?.video} 
                      controls 
                      className="w-full rounded-lg"
                      style={{ maxHeight: '200px' }}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (video.preview && video.preview.startsWith(baseUrl)) {
                          await apiService.delete({
                            url: "/video",
                            dto: { filepath: video.preview.replace(baseUrl, "") },
                          });
                        }
                        setVideo(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1"
                    >
                      <img src={XIcon} className="w-[15px]" alt="" />
                    </button>
                    <div className="flex justify-between mt-1">
                      <Typography size={12} weight={400} color={COLORS_TEXT.gray100}>
                        {(t("duration") || "Длительность") + ": " + Math.floor(video.duration / 60) + ":" + Math.floor(video.duration % 60).toString().padStart(2, '0')}
                      </Typography>
                      <Typography size={12} weight={400} color={COLORS_TEXT.gray100}>
                        {(t("size")) + ": " + (video.size / (1024 * 1024)).toFixed(2) + " МБ"}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={Boolean(error?.message) || !isPhoneValid}
                  helperText={
                    error?.message || (!isPhoneValid ? t("invalidNumber") : "")
                  }
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
                  onChange={(e) => {
                    field.onChange(e);
                    setIsPhoneValid(handleValidatePhone(e.target.value));
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
              disabled={!isValid || isLoading || !isPhoneValid}
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




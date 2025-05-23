import React, { FC, useState, useEffect } from "react";
import { Map, View } from "ol";
import "ol/ol.css";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Fill, Icon, Style } from "ol/style";
import locationIcon from "../../../app/icons/announcements/markerSvg.svg";
import { Typography } from "../../../shared/ui/Typography";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Announcement, Schedule } from "../model/announcements";
import BackIcon from "../../../app/icons/back-icon.svg";
import {
  categoryBgColors,
  categoryColors,
  COLORS_TEXT,
} from "../../../shared/ui/colors";
import { baseUrl } from "../../../services/api/ServerData";
import { Select } from "ol/interaction";
import defaultImage from "../../../app/icons/abstract-bg.svg";
import defaultAnnoun from "../../../app/icons/abstract-bg.svg";
import ellipse from "../../../app/icons/announcements/ellipseMalenkiy.svg";
import star from "../../../app/icons/announcements/StarYellow.svg";
import FavouriteIcon from "../../../app/icons/favourite.svg";
import FavouriteActiveIcon from "../../../app/icons/favourite-active.svg";
import { Button } from "../../../shared/ui/Button";
import cancelBlack from "../../../app/icons/announcements/xCancel-Black.svg";
import { CoveredImage } from "../../../shared/ui/CoveredImage";
import { useNavigate } from "@tanstack/react-router";
import CircleStyle from "ol/style/Circle";
import { useTranslation } from "react-i18next";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import whiteCircle from "../../../app/icons/EllipseWhite.svg";
import { DirectionsRenderer } from "@react-google-maps/api";
import { roleService } from "../../../services/storage/Factory";
import { ROLE_TYPE } from "../../auth/model/auth-model";
import { apiService } from "../../../services/api/ApiService";
import { queryClient } from "../../../ini/InitializeApp";

const containerStyle = {
  width: "100%",
  height: "90vh",
};

interface Props {
  announcements: Announcement[];
}
export const MapAnnoun: FC<Props> = ({ announcements }) => {
  const role = roleService.getValue();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLEMAP_API_KEY,
  });
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(
    null
  );
  useEffect(() => {
    if (window.google && window.google?.maps?.TravelMode) {
      setTravelMode(google.maps.TravelMode.DRIVING);
    }
  }, []);
  const [isLocationDenied, setIsLocationDenied] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocationDenied(false); // Если доступ есть, сбрасываем флаг отказа
        },
        (error) => {
          console.error("Ошибка при получении геолокации:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setIsLocationDenied(true); // Если юзер отказался, показываем модалку
          } else {
            setUserLocation({ lat: 52.2833, lng: 76.9667 }); // Фолбэк, если ошибка другая
          }
        }
      );
    } else {
      console.error("Геолокация не поддерживается этим браузером.");
      setUserLocation({ lat: 52.2833, lng: 76.9667 }); // Фолбэк, если браузер не поддерживает гео
    }
  }, []);
  const calculateRoute = async (latitude: number, longitude: number) => {
    if (!userLocation) {
      console.error("Геолокация пользователя недоступна!");
      return;
    }
    if (!isLoaded || !window.google || !window.google.maps) {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: userLocation,
        destination: { lat: longitude, lng: latitude },
        travelMode: travelMode || google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
    } catch (error) {
      console.error("Ошибка при построении маршрута:", error);
    }
  };
  const { t } = useTranslation();
  const [activeCategory, _setActiveCategory] = useState<string>("");
  const [_showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [_categoryInfo, _setCategoryInfo] = useState<string>("");
  const navigate = useNavigate();
  const [showAnnouncementModal, setShowAnnouncementModal] =
    useState<boolean>(false); // Для отображения модального окна с объявлением
  const getCurrentDaySchedule = (announcementInfo: Announcement | null) => {
    if (!announcementInfo?.schedule) {
      return { start: null, end: null }; // Возвращаем null если нет расписания
    }

    const days = [
      { start: "sunStart", end: "sunEnd" },
      { start: "monStart", end: "monEnd" },
      { start: "tueStart", end: "tueEnd" },
      { start: "wenStart", end: "wenEnd" },
      { start: "thuStart", end: "thuEnd" },
      { start: "friStart", end: "friEnd" },
      { start: "satStart", end: "satEnd" },
    ];

    const currentDayIndex = new Date().getDay();
    const currentDay = days[currentDayIndex];

    const start = announcementInfo.schedule[currentDay.start as keyof Schedule];
    const end = announcementInfo.schedule[currentDay.end as keyof Schedule];

    return { start, end };
  };
  const [announcementInfo, setAnnouncementInfo] = useState<Announcement | null>(
    null
  ); // Храним информацию о выбранном объявлении

  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([70.30456742278163, 53.08271195503471]),
        zoom: 15,
      }),
    });

    // Добавляем обработчик на выбор фич
    const selectInteraction = new Select({
      condition: (event) => event.type === "click" || event.type === "touch", // Условие для клика
    });

    selectInteraction.on("select", (e) => {
      const selectedFeature = e.selected[0]; // Получаем выбранную фичу
      if (selectedFeature) {
        const selectedAnnouncement = announcements.find(
          (item) => item.id === selectedFeature.getId() // Сопоставляем фичу с данным
        );
        if (selectedAnnouncement) {
          setAnnouncementInfo(selectedAnnouncement);
          setIsFavourite(selectedAnnouncement.isFavourite);
          setShowAnnouncementModal(true); // Показываем модальное окно
        }
      }
    });

    map.addInteraction(selectInteraction);

    const addMarkers = (
      addresses: { latitude: number; longitude: number }[],
      _categories: string
    ) => {
      vectorSource.clear(); // Очистка предыдущих маркеров
      addresses.forEach(({ latitude, longitude }, index) => {
        if (latitude === undefined || longitude === undefined) {
          return;
        }

        const transformedCoordinates = fromLonLat([latitude, longitude]);

        const marker = new Feature({
          geometry: new Point(transformedCoordinates),
        });

        // Получаем путь к изображению категории
        const category = announcements[index].subcategory?.category;
        const imagePath = category?.imgPath || locationIcon; // Если картинка категории есть, используем её

        const iconStyle = new Style({
          image: new Icon({
            color: categoryColors[category.name],
            src: locationIcon, // Стандартная иконка маркера
            scale: 1,
            anchor: [0.5, 1], // Центрируем иконку маркера
          }),

          zIndex: 0,
        });

        // Создание стиля для фона
        const backgroundStyle = new Style({
          image: new CircleStyle({
            radius: 10, // Радиус круга (фон)

            fill: new Fill({
              color: "white", // Цвет фона
            }),
          }),
          zIndex: 1,
        });

        // Создание стиля для изображения
        const markerIconStyle = new Style({
          image: new Icon({
            src: loadImage(imagePath), // Путь к изображению
            scale: 0.4, // Масштаб изображения
            anchor: [0.5, 2.35], // Центрируем изображение
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
          }),
          zIndex: 2,
        });

        // Применение стилей к маркеру
        marker.setStyle([backgroundStyle, markerIconStyle, iconStyle]);
        backgroundStyle.getImage()?.setDisplacement([0, 25]);

        // Устанавливаем ID маркера с помощью ID объявления
        marker.setId(announcements[index].id.toString());

        // Устанавливаем id фичи для связи с данными
        marker.setId(announcements[index].id); // Устанавливаем id фичи для связи с данными

        vectorSource.addFeature(marker);
      });

      map.updateSize();
    };

    const addresses = announcements
      .map((announcement) => announcement.address)
      .filter(Boolean);

    addMarkers(addresses, activeCategory);

    return () => {
      map.setTarget(undefined);
      map.removeInteraction(selectInteraction); // Убираем взаимодействие при удалении карты
    };
  }, [announcements, activeCategory]);

  const handleCloseModal = () => {
    setShowCategoryModal(false);
    setShowAnnouncementModal(false); // Закрываем и модальное окно с информацией о объявлении
  };

  const loadImage = (imgPath: string | undefined) => {
    return imgPath ? baseUrl + imgPath : defaultImage;
  };

  // Создаем переменную для отслеживания уже отображенных категорий
  // const openGoogleMaps = (latitude: number, longitude: number) => {
  //   const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
  //   window.open(url, "_blank"); // Открывает ссылку в новой вкладке
  // };

  const { start, end } = getCurrentDaySchedule(announcementInfo);
  // Получаем текущую дату и время
  const currentTime = new Date();

  // Извлекаем из строки времени end только часы и минуты
  const [hours, minutes] = end?.split(":").map(Number) || [0, 0];
  const center = {
    lat: 53.08271195503471,
    lng: 70.30456742278163,
  };
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const handleMarkerClick = (announcementId: string) => {
    setSelectedMarker(announcementId);
    const selectedAnnouncement = announcements.find(
      (announcement) => announcement.id === announcementId
    );
    if (selectedAnnouncement) {
      setAnnouncementInfo(selectedAnnouncement);
      setIsFavourite(selectedAnnouncement.isFavourite);
      setShowAnnouncementModal(true);
    }
  };
  // Создаем объект Date для времени закрытия, где устанавливаем только часы и минуты
  let closingTime = new Date();
  closingTime.setHours(hours, minutes, 0, 0); // Устанавливаем время в объекте Date

  // Проверяем, если время закрытия меньше текущего времени, то заведение закрыто
  const isClosed =
    hours == 0 && minutes == 0 ? false : closingTime < currentTime;
  const openLocationSettings = () => {
    if (/android/i.test(navigator.userAgent)) {
      // Открыть настройки геолокации на Android
      window.location.href =
        "intent://settings#Intent;scheme=android.settings.LOCATION_SOURCE_SETTINGS;end";
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Открыть настройки приложения на iOS
      window.location.href = "app-settings:";
    } else {
      alert("Откройте настройки вручную и разрешите доступ к геолокации.");
    }
  };
  const [isFavourite, setIsFavourite] = useState<boolean>(
    announcementInfo?.isFavourite || false
  );

  const addToFavourite = async () => {
    if (announcementInfo) {
      await apiService.get({
        url: `/ad/favorite/${announcementInfo.id}`,
      });
      isFavourite ? setIsFavourite(false) : setIsFavourite(true);
      await queryClient.refetchQueries({ queryKey: ["ad/favorite/list"] });
      await queryClient.refetchQueries({
        queryKey: ["main-page-announcements"],
      });
    }
  };
  return (
    <main className="min-h-screen">
      <Header pb="0">
        <div className="flex items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div className="flex justify-center w-[75%] ">
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("mapAnnoun")}
            </Typography>
          </div>
        </div>
      </Header>

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            streetViewControl: false,
          }}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {announcements.map((announcement) => {
            const isSelected = selectedMarker === announcement.id;
            if (
              !announcement.address ||
              !announcement.address.latitude ||
              !announcement.address.longitude
            ) {
              return null;
            }

            const subcategoryImgPath = loadImage(
              announcement.subcategory?.category?.imgPath
            );

            const categoryName = announcement.subcategory?.category?.name;
            const categoryColor = categoryColors[categoryName];

            const svgLocationWithColor = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M36.75 17.2881C36.75 28.4327 23.3562 38.5496 21.2714 40.0569C21.1029 40.1787 20.8971 40.1787 20.7286 40.0569C18.6438 38.5496 5.25 28.4327 5.25 17.2881C5.25 8.70665 12.3015 1.75 21 1.75C29.6985 1.75 36.75 8.70665 36.75 17.2881Z" fill="${categoryColor}"/>
      <circle cx="21" cy="17.5" r="7" fill="white"/>
    </svg>`)}`;
            return (
              <React.Fragment key={announcement.id}>
                <Marker
                  key={`${announcement.id}-svg`}
                  position={{
                    lat: announcement.address.longitude,
                    lng: announcement.address.latitude,
                  }}
                  icon={{
                    url: svgLocationWithColor,
                    scaledSize: new google.maps.Size(
                      isSelected ? 50 : 40,
                      isSelected ? 50 : 40
                    ),
                    fillColor: categoryColor,
                  }}
                  zIndex={1}
                  onClick={() => handleMarkerClick(announcement.id)}
                />
                <Marker
                  key={`${announcement.id}-subcategory`}
                  position={{
                    lat: announcement.address.longitude,
                    lng: announcement.address.latitude,
                  }}
                  icon={{
                    url: subcategoryImgPath,
                    scaledSize: new google.maps.Size(
                      isSelected ? 18 : 16,
                      isSelected ? 18 : 16
                    ),
                    anchor: new google.maps.Point(
                      isSelected ? 9 : 8,
                      isSelected ? 38 : 32
                    ),
                    fillColor: "white",
                    strokeColor: "white",
                  }}
                  zIndex={2}
                  onClick={() => handleMarkerClick(announcement.id)}
                />
                <Marker
                  key={`${announcement.id}-whiteCircle`}
                  position={{
                    lat: announcement.address.longitude,
                    lng: announcement.address.latitude,
                  }}
                  icon={{
                    url: whiteCircle,
                    scaledSize: new google.maps.Size(
                      isSelected ? 26 : 24,
                      isSelected ? 26 : 24
                    ),
                    anchor: new google.maps.Point(
                      isSelected ? 13 : 12,
                      isSelected ? 42 : 36
                    ),
                  }}
                  zIndex={1}
                  onClick={() => handleMarkerClick(announcement.id)}
                />
              </React.Fragment>
            );
          })}
        </GoogleMap>
      ) : (
        <div>
          <Typography size={16} weight={600}>
            {"Загрузка"}
          </Typography>
        </div>
      )}
      {/* Модальное окно для объявления */}
      {showAnnouncementModal && announcementInfo && (
        <div
          key={announcementInfo.id}
          className="fixed bottom-0 left-0 flex w-full z-[9999]"
        >
          <div className="bg-white p-4 w-full justify-center rounded-lg shadow-lg">
            <div className="">
              <div className="grid justify-center flex-col gap-4">
                <div className="flex flex-col">
                  <Typography size={18} weight={500}>
                    {announcementInfo.title}
                  </Typography>
                  {announcementInfo.duration ? (
                    <Typography className="mb-4">
                      {`${t("DurationOfService")} - ${announcementInfo.duration}`}
                    </Typography>
                  ) : (
                    <Typography className="mb-2">{t("allDay")}</Typography>
                  )}
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <CoveredImage
                    borderRadius="rounded-lg"
                    errorImage={defaultAnnoun}
                    width="w-40"
                    height="h-40"
                    imageSrc={announcementInfo.images[0]}
                  >
                    <div className="flex items-center">
                      <div
                        className={`mt-2 ml-2 relative w-7 h-7 flex items-center rounded-full ${categoryBgColors[announcementInfo.subcategory.category.name]}`}
                      >
                        <img
                          className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 brightness-[25] z-10"
                          src={`${baseUrl}${announcementInfo.subcategory.category.imgPath || ""}`}
                        />
                      </div>
                    </div>
                  </CoveredImage>
                  <div>
                    <div className="flex flex-row justify-between">
                      <Typography
                        size={28}
                        weight={700}
                        color={COLORS_TEXT.blue200}
                      >
                        {announcementInfo.price && announcementInfo.price > 0
                          ? `${announcementInfo.price} ₸`
                          : t("free")}
                      </Typography>
                      {role == ROLE_TYPE.TOURIST && (
                        <IconContainer
                          align="center"
                          action={() => addToFavourite()}
                        >
                          <img
                            src={
                              isFavourite ? FavouriteActiveIcon : FavouriteIcon
                            }
                            alt=""
                          />
                        </IconContainer>
                      )}
                    </div>
                    <div className="flex flex-row gap-2">
                      <img src={star} alt="" />
                      <Typography size={16} weight={400}>
                        {announcementInfo.avgRating}
                      </Typography>
                      <img src={ellipse} alt="" />
                      <Typography
                        weight={400}
                        size={16}
                        color={COLORS_TEXT.gray100}
                        className=""
                      >
                        {`${announcementInfo.reviewCount} ${t("grades")}`}
                      </Typography>
                    </div>
                    {announcementInfo?.schedule && start && end && (
                      <Typography size={14} weight={400}>
                        {`${t("todayWith")} ${start} ${t("to")} ${end}`}
                      </Typography>
                    )}
                    {announcementInfo?.schedule && (
                      <Typography
                        size={14}
                        weight={400}
                        color={COLORS_TEXT.gray100}
                      >
                        {isClosed ? t("closed") : t("open")}
                      </Typography>
                    )}
                    <Button
                      onClick={() => {
                        if (
                          announcementInfo?.address?.latitude &&
                          announcementInfo?.address?.longitude
                        ) {
                          calculateRoute(
                            announcementInfo.address.latitude,
                            announcementInfo.address.longitude
                          );
                        }
                      }}
                      mode="transparent"
                      className="text-blue200 max-w-fit"
                    >
                      {`${t("BuildTheRoad")}`}
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  navigate({
                    to: "/announcements/$announcementId",
                    params: {
                      announcementId: announcementInfo.id,
                    },
                  });
                }}
                mode="default"
                className="mt-4"
              >
                {`${t("MoreDetails")}`}
              </Button>
            </div>
            <button
              onClick={handleCloseModal}
              className=" absolute top-5 right-5 w-4 h-4 p-0 rounded-full bg-transparent flex items-center justify-center  group"
            >
              <IconContainer align="center">
                <img src={cancelBlack} className="z-10" alt="" />
              </IconContainer>
            </button>
          </div>
        </div>
      )}
      <div className="fixed left-0 bottom-2 px-2 w-full z-10">
        <Button onClick={() => history.back()} mode="default">
          {t("backMap")}
        </Button>
      </div>
      {isLocationDenied && (
        <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[350px] p-6 rounded-lg shadow-lg text-center">
            <Typography size={16} weight={500} className=" mb-2">
              {t("GeoOn")}
            </Typography>
            <Typography size={14} weight={400} className="text-gray-600 mb-4">
              {t("NeedGeo")}
            </Typography>
            <Button
              onClick={openLocationSettings}
              className="px-4 py-2 text-white shadow-md"
            >
              {t("OpenSettings")}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

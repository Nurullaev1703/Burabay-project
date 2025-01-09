import { FC, useState, useEffect } from "react";
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
import { categoryBgColors, categoryColors, COLORS_TEXT } from "../../../shared/ui/colors";
import { baseUrl } from "../../../services/api/ServerData";
import { Select } from "ol/interaction";
import defaultImage from "../../../app/icons/main/health.svg";
import defaultAnnoun from "../../../app/img/ploshadka.jpeg";
import ellipse from "../../../app/icons/announcements/ellipseMalenkiy.svg";
import star from "../../../app/icons/announcements/StarYellow.svg";
import flag from "../../../app/icons/announcements/falg.svg";
import { Button } from "../../../shared/ui/Button";
import cancelBlack from "../../../app/icons/announcements/xCancel-Black.svg";
import { CoveredImage } from "../../../shared/ui/CoveredImage";
import { useNavigate } from "@tanstack/react-router";
import CircleStyle from "ol/style/Circle";
import { useTranslation } from "react-i18next";
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "90vh",
};

interface Props {
  announcements: Announcement[];
}

export const MapAnnoun: FC<Props> = ({ announcements }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCLVQH3hDuec-HJXPMBuEChJ1twbVP1D6Q", // Замените на ваш ключ API
  });
  const { t } = useTranslation();
  const [activeCategory, _setActiveCategory] = useState<string>("");
  const [_showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [_categoryInfo, _setCategoryInfo] = useState<string>("");
  const navigate = useNavigate();
  const [showAnnouncementModal, setShowAnnouncementModal] =
  useState<boolean>(false); // Для отображения модального окна с объявлением
  const getCurrentDaySchedule = (announcementInfo: Announcement | null) => {
    if (!announcementInfo?.schedule) {
      return { start: null, end: null }; // Возвращаем null, если нет расписания
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

        // Создаем кастомный маркер с изображением категории внутри

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
  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank"); // Открывает ссылку в новой вкладке
  };

  const { start, end } = getCurrentDaySchedule(announcementInfo);
    // Получаем текущую дату и время
const currentTime = new Date();

// Извлекаем из строки времени end только часы и минуты
const [hours, minutes] = end?.split(':').map(Number) || [0,0];
const center = {
  lat: 53.08271195503471, 
  lng: 70.30456742278163,
};
const handleMarkerClick = (announcementId: string) => {
  const selectedAnnouncement = announcements.find(
    (announcement) => announcement.id === announcementId
  );
  if (selectedAnnouncement) {
    setAnnouncementInfo(selectedAnnouncement);
    setShowAnnouncementModal(true);
  }
};

// Создаем объект Date для времени закрытия, где устанавливаем только часы и минуты
let closingTime = new Date();
closingTime.setHours(hours, minutes, 0, 0); // Устанавливаем время в объекте Date


// Проверяем, если время закрытия меньше текущего времени, то заведение закрыто
const isClosed = hours == 0 && minutes == 0 ? false : closingTime < currentTime; 

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
  >
{announcements.map((announcement) => {
  if (!announcement.address || !announcement.address.latitude || !announcement.address.longitude) {
    return null; 
  }

  return (
    <Marker
      key={announcement.id}
      position={{
        lat: announcement.address.longitude,
        lng: announcement.address.latitude,
      }}
      icon={{
        url: locationIcon,
        scaledSize: new google.maps.Size(40, 40),
      }}
      onClick={() => handleMarkerClick(announcement.id)}
    />
  );
})}

  </GoogleMap>
) : (
  <div>
    <Typography size={16} weight={600}>{"Загрузка"}</Typography>
  </div>
)}
      {/* Модальное окно для объявления */}
      {showAnnouncementModal && announcementInfo && (
        <div
          key={announcementInfo.id}
          className="fixed bottom-0 left-0 flex w-full z-[9999]"
        >
          <div className="bg-white p-4 w-full rounded-lg shadow-lg">
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
            <div className="">
              <div className="flex gap-4">
                <CoveredImage
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
                        className="absolute top-3.5 left-3.5 w-4 h-4 -translate-x-1/2 -translate-y-1/2 brightness-200 z-10"
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
                    <img src={flag} alt="" />
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
                  {announcementInfo?.schedule &&(
                    <Typography
                      size={14}
                      weight={400}
                      color={COLORS_TEXT.gray100}
                    >
                      {isClosed ? t("closed") : t("open")}
                    </Typography>
                  )}
                  <Button
                    onClick={() =>
                      openGoogleMaps(
                        announcementInfo?.address.longitude,
                        announcementInfo?.address.latitude
                      )
                    }
                    mode="transparent"
                  >
                    {`${t("BuildTheRoad")}`}
                  </Button>
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
              className=" absolute  top-5 right-5 w-4 h-4 p-0 rounded-full bg-transparent flex items-center justify-center  group"
            >
              <IconContainer align="center">
                <img src={cancelBlack} className="z-10" alt="" />
              </IconContainer>
            </button>
          </div>
        </div>
      )}
      <div className="fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full z-10">
        <Button onClick={() => history.back()} mode="default">
          {t("backMap")}
        </Button>
      </div>
    </main>
  );
};

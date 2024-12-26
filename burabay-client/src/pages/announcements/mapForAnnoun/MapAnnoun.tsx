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
import { Announcement } from "../model/announcements";
import BackIcon from "../../../app/icons/back-icon.svg";
import { COLORS_TEXT } from "../../../shared/ui/colors";
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

const containerStyle = {
  width: "100%",
  height: "90vh",
};

interface Props {
  announcements: Announcement[];
}

export const MapAnnoun: FC<Props> = ({ announcements, }) => {
  const categoryColors: Record<string, string> = {
    Отдых: "bg-[#39B598]",
    Жилье: "bg-[#5EBAE1]",
    Здоровье: "bg-[#DC53AD]",
    Экстрим: "bg-[#EF5C7F]",
    Достопримечательности: "bg-[#B49081]",
    Питание: "bg-[#F4A261]",
    Развлечения: "bg-[#E5C82F]",
    Прокат: "bg-[#A16ACD]",
    Безопасность: "bg-[#777CEF]",
  };
  const colors: Record<string, string> = {
    Отдых: "#39B598",
    Жилье: "#5EBAE1",
    Здоровье: "#DC53AD",
    Экстрим: "#EF5C7F",
    Достопримечательности: "#B49081",
    Питание: "#F4A261",
    Развлечения: "#E5C82F",
    Прокат: "#A16ACD",
    Безопасность: "#777CEF",
  };

  const {t}= useTranslation()
  const [activeCategory, _setActiveCategory] = useState<string>("");
  const [_showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [_categoryInfo, _setCategoryInfo] = useState<string>("");
  const navigate = useNavigate();
  const [showAnnouncementModal, setShowAnnouncementModal] =
    useState<boolean>(false); // Для отображения модального окна с объявлением
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
      condition: (event) => event.type === "click", // Условие для клика
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
            color: colors[category.name],
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

      <div
        id="map"
        style={{
          ...containerStyle,
          transition: "opacity 0.3s ease-in-out",
        }}
      ></div>
      {/* Модальное окно для объявления */}
      {showAnnouncementModal && announcementInfo && (
        <div className="fixed bottom-0 left-0 flex w-full z-[9999]">
          <div className="bg-white p-4 w-full rounded-lg shadow-lg">
            <Typography size={18} weight={500}>
              {announcementInfo.title}
            </Typography>

            <Typography className="mb-4">
              {t("DurationOfService") + " - "} {announcementInfo.startTime}
            </Typography>
            <div className="">
              <div className="flex gap-4">
                <CoveredImage
                  errorImage={defaultAnnoun}
                  width="w-40"
                  height="h-40"
                  imageSrc={defaultAnnoun}
                >
                  <div className="flex items-center">
                    <div
                      className={`mt-2 ml-2 relative w-7 h-7 flex items-center rounded-full ${categoryColors[announcementInfo.subcategory.category.name]}`}
                    >
                      <img
                        className="absolute top-3.5 left-3.5 w-4 h-4 -translate-x-1/2 -translate-y-1/2 mix-blend-screen z-10"
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
                      {announcementInfo.price} ₸
                    </Typography>
                    <img src={flag} alt="" />
                  </div>
                  <div className="flex flex-row gap-2">
                    <img src={star} alt="" />
                    <Typography size={16} weight={400}>
                      {"4.8"}
                    </Typography>
                    <img src={ellipse} alt="" />
                    <Typography
                      weight={400}
                      size={16}
                      color={COLORS_TEXT.gray100}
                      className=""
                    >
                      {(`12 ${t("grades")}`)}
                    </Typography>
                  </div>
                  <Typography size={14} weight={400}>
                    {`${t('todayWith')} 9:00 ${t('to')} 19:00`}
                  </Typography>
                  <Typography
                    size={14}
                    weight={400}
                    color={COLORS_TEXT.gray100}
                  >
                    {`${t("open")}`}
                  </Typography>
                  <Button
                    onClick={() =>
                      openGoogleMaps(
                        announcementInfo?.address.longitude,
                        announcementInfo?.address.latitude
                      )
                    }
                    mode="transparent"
                  >
                    {`${t("BuildTheRoad")}` }
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
            <div className="fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full">
        <Button onClick={() => history.back()} mode="default">{t("backMap")}</Button>
      </div>

    </main>
  );
};
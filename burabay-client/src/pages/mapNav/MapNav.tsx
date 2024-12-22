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
import locationIcon from "../../app/icons/main/markerMap.png";
import { Typography } from "../../shared/ui/Typography";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg";
import { Announcement, Category } from "../announcements/model/announcements";
import BackIcon from "../../app/icons/back-icon.svg";
import { COLORS_TEXT } from "../../shared/ui/colors";
import BigSearch from "../../app/icons/announcements/bigSearch.svg";
import cancel from "../../app/icons/announcements/xCancel.svg";
import { baseUrl } from "../../services/api/ServerData";
import { Select } from "ol/interaction";
import defaultImage from "../../app/icons/main/health.svg";
import defaultAnnoun from "../../app/img/ploshadka.jpeg";
import ellipse from "../../app/icons/announcements/ellipseMalenkiy.svg";
import star from "../../app/icons/announcements/StarYellow.svg";
import flag from "../../app/icons/announcements/falg.svg";
import { Button } from "../../shared/ui/Button";
import cancelBlack from "../../app/icons/announcements/xCancel-Black.svg";
import { CoveredImage } from "../../shared/ui/CoveredImage";
import { useNavigate } from "@tanstack/react-router";

const containerStyle = {
  width: "100%",
  height: "90vh",
};

interface Props {
  announcements: Announcement[];
  categories: Category[];
}

const initialCenter = [70.31, 53.08];

export const MapNav: FC<Props> = ({ announcements, categories }) => {
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

  // const [map, setMap] = useState<Map | null>(null);
  // const [markers, setMarkers] = useState<Feature[]>([]);
  // const [address, setAddress] = useState<string>("");
  const [announcementsName, setAnnouncementsName] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [activeCategory, _setActiveCategory] = useState<string >("");
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [_categoryInfo, _setCategoryInfo] = useState<string>("");
  const navigate = useNavigate();
  const [showAnnouncementModal, setShowAnnouncementModal] =
    useState<boolean>(false); // Для отображения модального окна с объявлением
  const [announcementInfo, setAnnouncementInfo] = useState<Announcement | null>(
    null
  ); // Храним информацию о выбранном объявлении

  // const categories = Array.from(
  //   new Set(
  //     announcements
  //       .map((item) => item.subcategory?.category.name)
  //       .filter(Boolean)
  //   )
  // );

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
        zoom: 14,
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
      categories: string
    ) => {
      addresses.forEach(({ latitude, longitude }, index) => {
        if (latitude === undefined || longitude === undefined) {
          console.warn("Некорректные координаты:", { latitude, longitude });
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
            src: locationIcon, // Стандартная иконка маркера
            scale: 0.7,
            anchor: [0.5, 1], // Центрируем иконку маркера
          }),
        });

        // Создаем кастомный маркер с изображением категории внутри
        const customIcon = new Style({
          image: new Icon({
          
            src: loadImage(imagePath),
            scale: 0.5,
            anchor: [0.5, 1.5], // Центрируем изображение категории в маркере
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            color: "white"
            
          }),

        });

        marker.setStyle([iconStyle, customIcon]);

        marker.setId(announcements[index].id); // Устанавливаем id фичи для связи с данными

        vectorSource.addFeature(marker);
      });

      map.updateSize();
    };

    const addresses = announcements
      .map((announcement) => announcement.address)
      .filter(Boolean);

    addMarkers(addresses , activeCategory);

    return () => {
      map.setTarget(undefined);
      map.removeInteraction(selectInteraction); // Убираем взаимодействие при удалении карты
    };
  }, [announcements, activeCategory]);

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(announcementsName.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnouncementsName(e.target.value);
  };

  const handleInputFocus = () => {
    setIsSearchMode(true);
  };

  const handleInputBlur = () => {
    setIsSearchMode(false);
  };

  // const handleSearchClick = () => {
  //   setIsSearchMode(true);
  // };

  // const handleCategoryClick = (categoryName: string) => {
  //   setActiveCategory(activeCategory === categoryName ? null : categoryName);
  //   setShowCategoryModal(true);
  //   const categoryAnnouncements = announcements.filter(
  //     (announcement) => announcement.subcategory?.category.name === categoryName
  //   );
  //   setCategoryInfo(
  //     categoryAnnouncements[0]?.subcategory?.category.description ||
  //       "Информация отсутствует"
  //   );
  // };

  const handleCloseModal = () => {
    setShowCategoryModal(false);
    setShowAnnouncementModal(false); // Закрываем и модальное окно с информацией о объявлении
  };

  const loadImage = (imgPath: string | undefined) => {
    return imgPath ? baseUrl + imgPath : defaultImage;
  };


  // Создаем переменную для отслеживания уже отображенных категорий
  // const displayedCategories = new Set<string>();
  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank"); // Открывает ссылку в новой вкладке
  };

  return (
    <main className="min-h-screen">
      <Header pb="0" className="">
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} />
          </IconContainer>
          <div className="w-full flex items-center  gap-2 bg-gray-100 rounded-full px-2 py-1 shadow-sm">
            <img src={SearchIcon} />
            <input
              type="text"
              placeholder="Поиск объявлений"
              value={announcementsName}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="flex-grow bg-transparent outline-none "
            />
          </div>
        </div>
      </Header>

      <div
        id="map"
        style={{
          ...containerStyle,
          transition: "opacity 0.3s ease-in-out",
          opacity: isSearchMode ? 0 : 1,
        }}
      ></div>

      {isSearchMode && (
        <div className="absolute top-14 left-0 right-0 bottom-0 bg-white p-4 overflow-y-auto">
          {announcementsName.trim() === "" ? (
            <div className="flex justify-center flex-col items-center mt-52">
              <img src={BigSearch} className="" alt="" />
              <Typography size={16} weight={400} color={COLORS_TEXT.gray100}>
                Начните вводить название услуги
              </Typography>
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex flex-col justify-start mb-2 border-b pb-2"
              >
                <Typography>{announcement.title}</Typography>
                <Typography size={14} weight={400} color={COLORS_TEXT.gray100}>
                  {announcement.subcategory?.name}
                </Typography>
              </div>
            ))
          ) : (
            <Typography
              className="flex items-center justify-center"
              size={16}
              weight={400}
              color={COLORS_TEXT.gray100}
            >
              Ничего не найдено
            </Typography>
          )}
        </div>
      )}

      {!isSearchMode && (
        <div className="relative top-[-80px] left-0 flex justify-start w-full overflow-x-scroll gap-2 ">
          {categories.map((item) => {
            return (
              <button
              type="button"
                onClick={() => _setActiveCategory(item.name)}
                key={item.id}
                className={`
                     w-fit
                    rounded-full justify-between  flex  items-center p-1 pr-4 gap-2 ${activeCategory === item.name ? categoryColors[item.name]: "bg-white"} `}
              >
                
                <div
                  className={`relative min-w-7 min-h-7 rounded-full ${categoryColors[item.name]}  `}
                >
                  
                  <img
                    src={baseUrl + item.imgPath}
                    className="absolute top-1/2 left-1/2 w-4 h-4 mr-2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen z-10"
                  />
                </div>
                <Typography
                  size={16}
                  weight={400}
                  color={activeCategory === item.name ? COLORS_TEXT.white : ""}
                  className={`text-center line-clamp-1`}
                >
                  {item.name}
                </Typography>

                {activeCategory === item.name && (
                  <div className="w-3">
                  <img
                    src={cancel}
                    alt="Close"
                    className=""
                    onClick={() => _setActiveCategory("")}
                  />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Модальное окно для категории */}
      {showCategoryModal && announcementInfo && (
        <div className="fixed bottom-40 left-0 right-0 bg-white p-4 shadow-lg rounded-t-lg">
          <Typography size={18} weight={600}>
            {activeCategory}
          </Typography>
          <Typography size={14} weight={400} color={COLORS_TEXT.gray100}>
            {announcementInfo.duration}
          </Typography>

          <button
            onClick={handleCloseModal}
            className="text-xl text-gray-500 absolute top-2 right-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Модальное окно для объявления */}
      {showAnnouncementModal && announcementInfo && (
        <div className="fixed bottom-0 left-0 flex w-full z-[9999]">
          <div className="bg-white p-4 w-full rounded-lg shadow-lg">
            <Typography size={18} weight={500}>
              {announcementInfo.title}
            </Typography>

            <Typography className="mb-4">
              {"Длительность услуги -"} {announcementInfo.startTime}
            </Typography>
            <div className="">
              <div className="flex gap-4">
                <CoveredImage
                  errorImage={defaultAnnoun}
                  width="w-40"
                  height="h-40"
                  imageSrc={defaultAnnoun}
                >
                  <img
                    className="absolute top-2 w-7 h-7 left-2"
                    src={`${baseUrl}${announcementInfo.subcategory.category.imgPath || ""}`}
                  />
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
                      {"12 оценок"}
                    </Typography>
                  </div>
                  <Typography size={14} weight={400}>
                    {"Сегодня с 9:00 до 19:00"}
                  </Typography>
                  <Typography
                    size={14}
                    weight={400}
                    color={COLORS_TEXT.gray100}
                  >
                    {"Открыто"}
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
                    {"Построить маршрут "}
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
                {"Подробнее"}
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
      <NavMenuClient />
    </main>
  );
};

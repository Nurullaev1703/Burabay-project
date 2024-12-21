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
import { Icon, Style } from "ol/style";
import locationIcon from "../../app/icons/main/markerMap.png";
import SearchIcon from "../../app/icons/search-icon.svg";
import { Typography } from "../../shared/ui/Typography";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import { Announcement } from "../announcements/model/announcements";
import BackIcon from "../../app/icons/back-icon.svg";
import { COLORS_TEXT } from "../../shared/ui/colors";
import BigSearch from "../../app/icons/announcements/bigSearch.svg"

const containerStyle = {
  width: "100%",
  height: "90vh",
};

interface Props {
  announcements: Announcement[]; // Передаем массив объявлений через пропсы
}

const initialCenter = [70.31, 53.08]; // Координаты для Борового

export const MapNav: FC<Props> = ({ announcements }) => {
  const [map, setMap] = useState<Map | null>(null);
  const [markers, setMarkers] = useState<Feature[]>([]);
  const [address, setAddress] = useState<string>("");
  const [announcementsName, setAnnouncementsName] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false); // состояние для отображения карты или списка


  useEffect(() => {
    // Источник данных для маркеров
    const vectorSource = new VectorSource();

    // Слой для маркеров
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Создание карты
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([70.30456742278163, 53.08271195503471]), // Боровое
        zoom: 14,
      }),
    });

    // Функция для добавления маркеров
    const addMarkers = (
      addresses: { latitude: number; longitude: number }[]
    ) => {
      addresses.forEach(({ latitude, longitude }) => {
        if (latitude === undefined || longitude === undefined) {
          console.warn("Некорректные координаты:", { latitude, longitude });
          return;
        }

        const transformedCoordinates = fromLonLat([latitude, longitude]);

        const marker = new Feature({
          geometry: new Point(transformedCoordinates),
        });

        marker.setStyle(
          new Style({
            image: new Icon({
              src: locationIcon,
              scale: 0.7, // Размер значка
            }),
          })
        );

        vectorSource.addFeature(marker);
      });

      map.updateSize(); // Обновление карты
    };

    // Получаем только адреса (координаты) из объявлений
    const addresses = announcements
      .map((announcement) => announcement.address)
      .filter(Boolean);

    // Добавляем маркеры, передавая только координаты
    addMarkers(addresses);

    // Очистка карты при размонтировании компонента
    return () => map.setTarget(undefined);
  }, [announcements]);

  // Фильтрация объявлений по названию
  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(announcementsName.toLowerCase())
  );

  // Обработчик изменения текста в поисковом поле
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnouncementsName(e.target.value); // Изменяем значение поиска
  };

  // Обработчик focus на input
  const handleInputFocus = () => {
    setIsSearchMode(true); // Включаем режим поиска при фокусе
  };

  // Обработчик blur с input
  const handleInputBlur = () => {
    setIsSearchMode(false); // Выключаем режим поиска при потере фокуса
  };

  // Обработчик нажатия на кнопку поиска (как альтернативный вариант)
  const handleSearchClick = () => {
    setIsSearchMode(true); // Включаем режим поиска при нажатии на кнопку
  };

  return (
    <main className="min-h-screen">
      <Header pb="0" className="">
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon}  />
          </IconContainer>
          <div className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1 shadow-sm">
            <img src={SearchIcon} />
            <input
              type="text"
              placeholder="Поиск объявлений"
              value={announcementsName}
              onChange={handleSearchChange} // Вызов обработчика
              onFocus={handleInputFocus} // Обработчик фокуса на input
              onBlur={handleInputBlur} // Обработчик потери фокуса
              className="flex-grow bg-transparent outline-none "
            />
          </div>
        </div>
      </Header>

      {/* Условное отображение карты или списка объявлений с анимацией */}
      <div
        id="map"
        style={{
          ...containerStyle,
          transition: "opacity 0.3s ease-in-out", // Плавный переход для скрытия карты
          opacity: isSearchMode ? 0 : 1, // Скрываем карту, если активен режим поиска
        }}
      ></div>

      {/* Список результатов поиска */}
      {isSearchMode && (
        <div className="absolute top-14 left-0 right-0 bottom-0 bg-white p-4 overflow-y-auto">

          {/* Показать сообщение, если пользователь не ввел ничего */}
          {announcementsName.trim() === "" ? (
            <div className="flex justify-center flex-col items-center mt-52">
            <img src={BigSearch} className="" alt="" />
            <Typography size={16} weight={400} color={COLORS_TEXT.gray100}>Начните вводить название услуги</Typography>
            </div>
          ) : // Показать результаты поиска, если они есть
          filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              
              <div
                key={announcement.id}
                className="flex items-center mb-2 border-b pb-2"
              >
                <Typography>{announcement.title}</Typography>
                <Typography size={14} weight={400} color={COLORS_TEXT.gray100}>
                {announcement.subcategory?.category?.name}  {announcement.subcategory?.name}           
              </Typography>
              </div>         
            ))
          ) : (
            <Typography className="flex items-center justify-center" size={16} weight={400} color={COLORS_TEXT.gray100}>Ничего не найдено</Typography>
          )}
        </div>
      )}

      <NavMenuClient />
    </main>
  );
};

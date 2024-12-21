import { FC, useState, useEffect } from "react";
import { Map, View } from "ol";
import "ol/ol.css";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
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
import { apiService } from "../../services/api/ApiService";

const containerStyle = {
  width: "100%",
  height: "90vh",
};

interface Props {
  announcements: Announcement[]; // Передаем массив объявлений через пропсы
}

const initialCenter = [70.310, 53.080]; // Координаты для Борового

export const MapNav: FC<Props> = ({ announcements }) => {
  const [map, setMap] = useState<Map | null>(null);
  const [markers, setMarkers] = useState<Feature[]>([]);
  const [address, setAddress] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string | null>(null);
  const [announcementsName, setAnnouncementsName] = useState<string>("");

  useEffect(() => {
    // Инициализация карты
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });

    const newMap = new Map({
      target: "map",
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat(initialCenter),
        zoom: 14,
      }),
    });

    // Убираем возможность добавления маркеров на карту при клике
    newMap.on("click", async (e) => {
      const coordinates = toLonLat(e.coordinate);
      const [lng, lat] = coordinates;

      try {
        const response = await apiService.get<any>({
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        });
        const { display_name, address } = response.data;
        setAddress(display_name);
        setHouseNumber(address?.house_number || null);
      } catch (error) {
        console.error("Ошибка при получении адреса:", error);
      }
    });

    // Добавляем маркеры для объявлений
    announcements.forEach((announcement) => {
      const { latitude = 0, longitude = 0 } = announcement.address; // Устанавливаем значение по умолчанию, если координаты не приходят
      if (latitude && longitude) {
        const marker = new Feature({
          geometry: new Point(fromLonLat([longitude, latitude])), // Преобразуем координаты в нужный формат
        });

        marker.setStyle(
          new Style({
            image: new Icon({
              src: locationIcon,
              scale: 0.5,
            }),
          })
        );

        vectorSource.addFeature(marker);
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      }
    });

    setMap(newMap);
    return () => newMap.setTarget(undefined);
  }, [announcements]); // Добавляем зависимость от объявлений

  // Фильтрация объявлений
  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(announcementsName.toLowerCase())
  );

  return (
    <main className="min-h-screen">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={SearchIcon} alt="" />
          </IconContainer>
          <div className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1 shadow-sm">
            <img src={SearchIcon} alt="" />
            <input
              type="text"
              placeholder="Поиск объявлений"
              value={announcementsName}
              onChange={(e) => setAnnouncementsName(e.target.value)}
              className="flex-grow bg-transparent outline-none text-gray-700"
            />
          </div>
        </div>
      </Header>
      <div id="map" style={containerStyle}></div>
      {address && (
        <div
          style={{
            position: "absolute",
            top: 100,
            left: 45,
            background: "white",
            padding: "10px",
          }}
        >
          <Typography>Адрес:</Typography> {address}
          {houseNumber && (
            <div>
              <Typography>Номер дома:</Typography> {houseNumber}
            </div>
          )}
        </div>
      )}
      <div className="absolute bottom-0 w-full bg-white p-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="flex items-center gap-4">
            <Typography>{announcement.title}</Typography>
          </div>
        ))}
      </div>
      <NavMenuClient />
    </main>
  );
};

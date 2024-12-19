import { FC, useState, useEffect } from 'react';
import { Map, View } from 'ol';
import 'ol/ol.css';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Tile as TileLayer } from 'ol/layer';
import FilterIcon from "../../app/icons/main/filter.svg"
import { OSM } from 'ol/source';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import SearchIcon from "../../app/icons/search-icon.svg"
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import location from '../../app/icons/main/markerMap.png';
import { Typography } from '../../shared/ui/Typography';
import { Header } from '../../components/Header';
import { COLORS_TEXT } from '../../shared/ui/colors';
import { IconContainer } from '../../shared/ui/IconContainer';
import { ProgressSteps } from '../announcements/ui/ProgressSteps';
import { apiService } from '../../services/api/ApiService';
import { Button } from '../../shared/ui/Button';
import { useNavigate } from '@tanstack/react-router';
import { NavMenuOrg } from '../../shared/ui/NavMenuOrg';
import { NavMenuClient } from '../../shared/ui/NavMenuClient';

const containerStyle = {
  width: '100%',
  height: '90vh',
};

const initialCenter = [70.310, 53.080]; // Координаты для Борового

export const MapNav: FC = () => {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState<Feature[]>([]); // храним маркеры
  const [address, setAddress] = useState<string>(''); // храним адресс 
  const [houseNumber, setHouseNumber] = useState<string | null>(null); // Храним номер дома
  const [announcementsName, setAnnouncementsName] = useState<string>("");

  useEffect(() => {  // Создание карты
    const vectorSource = new VectorSource({
      features: markers,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: 'map', // Контейнер, куда будет вставляться карта
      layers: [
        new TileLayer({
          source: new OSM(), // Источник для OpenStreetMap
        }),
        vectorLayer, // Добавляем слой с маркерами  
      ],
      view: new View({
        center: fromLonLat(initialCenter),
        zoom: 14,
      }),
    });

    map.on('click', async (e) => {  // Обработчик клика на карту
      const coordinates = toLonLat(e.coordinate); // Получаем координаты клика
      const newMarker = new Feature({ 
        geometry: new Point(e.coordinate), // Геометрия маркера как в математике)
      });
      newMarker.setStyle(
        new Style({
          image: new Icon({
            src: location, // сама иконка маркера
            scale: 0.5, // ее размерчик
          }),
        })
      );

      vectorSource.addFeature(newMarker);  // Добавляем маркер в источник
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      
      const [lng, lat] = coordinates;   // Получение адреса через Geocoding API
      try {
        const response = await apiService.get<any>({
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        });
        const { display_name, address } = response.data;
        setAddress(display_name); // Устанавливаем полный адрес
        setHouseNumber(address?.house_number || null); // Устанавливаем номер дома (если доступен)
      } catch (error) {
        console.error('Ошибка при получении адреса:', error);
      }
    });

    return () => map.setTarget(undefined); // Очистка карты при размонтировании компонента
  }, [markers]);

  return (
    <main className="min-h-screen">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={async () => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1 shadow-sm">
        <img src={SearchIcon} alt="" />
        <input
          type="text"
          placeholder="Поиск"
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
            position: 'absolute',
            top: 100,
            left: 45,
            background: 'white',
            padding: '10px',
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
      <NavMenuClient/>
    </main>

  );
};

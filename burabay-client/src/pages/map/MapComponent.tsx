import { FC, useState, useEffect } from 'react';
import { Map, View } from 'ol';
import 'ol/ol.css';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg"
import XIcon from "../../app/icons/announcements/blueKrestik.svg"
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Icon, Style } from 'ol/style';
import location from '../../app/icons/main/markerMap.png';
import axios from 'axios';
import { Typography } from '../../shared/ui/Typography';
import { Header } from '../../components/Header';
import { COLORS_TEXT } from '../../shared/ui/colors';
import { IconContainer } from '../../shared/ui/IconContainer';
import { ProgressSteps } from '../announcements/ui/ProgressSteps';
const containerStyle = {
  width: '100%',
  height: '100vh',
};

const initialCenter = [70.310, 53.080]; // Координаты для Борового

export const MapComponent: FC = () => {
  const [markers, setMarkers] = useState<Feature[]>([]); // Храним маркеры
  const [address, setAddress] = useState<string>(''); // Храним адрес

  useEffect(() => {
    // Создание карты
    const vectorSource = new VectorSource({
      features: markers, // добавление маркеров
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
        center: fromLonLat(initialCenter), // Устанавливаем начальную локацию на Боровое
        zoom: 14, // Уровень зума
      }),
    });

    // Обработчик клика на карту
    map.on('click', async (e) => {
      const coordinates = toLonLat(e.coordinate); // Получаем координаты клика
      const newMarker = new Feature({
        geometry: new Point(e.coordinate), // Геометрия маркера
      });
      newMarker.setStyle(
        new Style({
          image: new Icon({
            src: location, // Иконка маркера
            scale: 0.5,
          }),
        })
      );

      vectorSource.addFeature(newMarker); // Добавляем маркер в источник
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]); // Обновляем состояние маркеров

      // Получение адреса через Geocoding API
      const [lng, lat] = coordinates;
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        setAddress(response.data.display_name); // Устанавливаем адрес
      } catch (error) {
        console.error('Ошибка при получении адреса:', error);
      }
    });

    return () => map.setTarget(undefined); // Очистка карты при размонтировании компонента
  }, [markers]);

  return (
    <main className="min-h-screen">
      <Header>
    <div className='flex justify-between items-center text-center'>
      <IconContainer align='start' action={async() =>  history.back()}>
      <img src={BackIcon} alt="" />
      </IconContainer>
      <div>
      <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align='center'>{"Новое обьявление"}</Typography>
      <Typography size={14} weight={400} color={COLORS_TEXT.blue200} align='center'>{"Укажите место"}</Typography>
      </div>
      <IconContainer align='end' action={async() =>  history.back()}>
      <img src={XIcon} alt="" />
      </IconContainer>
      </div>
      <ProgressSteps currentStep={4} totalSteps={9}></ProgressSteps>
    </Header>
      <div id="map" style={containerStyle}></div>
      {address && (
        <div style={{ position: 'absolute', top: 100, left: 45, background: 'white', padding: '10px' }}>
          <Typography>Адрес:</Typography> {address}
        </div>
      )}
    </main>
  );
};

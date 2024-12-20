import { FC, useState, useEffect } from 'react';
import { Map, View } from 'ol';
import 'ol/ol.css';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
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

const containerStyle = {
  width: '100%',
  height: '90vh',
};

const initialCenter = [70.310, 53.080]; // Координаты для Борового

export const MapComponent: FC = () => {
  const navigate = useNavigate();
  const [marker, setMarker] = useState<Feature | null>(null); // Храним только одну метку
  const [address, setAddress] = useState<string>(''); // Храним адрес
  const [houseNumber, setHouseNumber] = useState<string | null>(null); // Храним номер дома
  const vectorSource = new VectorSource(); // Источник для слоя маркеров
  useEffect(() => {  
    let currentMarker: Feature | null = null; // Переменная для хранения текущего маркера
  
    const vectorSource = new VectorSource();
  
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
  
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat(initialCenter),
        zoom: 14,
      }),
    });
  
    map.on('click', async (e) => {
      const coordinates = e.coordinate; // Получаем координаты клика
      const [lng, lat] = toLonLat(coordinates); // Переводим координаты в долготу и широту
  
      if (!currentMarker) {
        // Если маркер отсутствует, создаем новый
        currentMarker = new Feature({
          geometry: new Point(coordinates),
        });
        currentMarker.setStyle(
          new Style({
            image: new Icon({
              src: location,
              scale: 0.5,
            }),
          })
        );
        vectorSource.addFeature(currentMarker); // Добавляем новый маркер в источник
      } else {
        // Если маркер уже существует, обновляем его координаты
        currentMarker.setGeometry(new Point(coordinates));
      }
  
      // Обновляем адрес
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
  }, []);
  

  return (
    <main className="min-h-screen">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={async () => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align="center">
              {"Новое объявление"}
            </Typography>
            <Typography size={14} weight={400} color={COLORS_TEXT.blue200} align="center">
              {"Укажите место"}
            </Typography>
          </div>
          <IconContainer align="end" action={async () => history.back()}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={4} totalSteps={9}></ProgressSteps>
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
      <div className="fixed left-0 bottom-6 mb-2 mt-2 px-2 w-full">
        <Button
          onClick={() =>
            navigate({
              to: `/announcements/addAnnouncements/step-five`,
            })
          }
          mode="default"
        >
          {"Продолжить"}
        </Button>
      </div>
    </main>
  );
};

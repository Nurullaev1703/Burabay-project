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
import { useAuth } from '../../features/auth';
import { use } from 'i18next';
import { HTTP_STATUS } from '../../services/api/ServerData';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

const containerStyle = {
  width: '100%',
  height: '90vh',
};

interface Props {
  adId: string;
}

const initialCenter = [70.310, 53.080]; // Координаты для Борового

export const MapComponent: FC<Props> = (props) => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const {user} = useAuth();
  const [address, setAddress] = useState<string>(''); // Храним адрес

  const [coords, setCoords] = useState<number[]>([])
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
      setCoords(toLonLat(coordinates))
  
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
      } catch (error) {
        console.error('Ошибка при получении адреса:', error);
      }
    });
  
    return () => map.setTarget(undefined); // Очистка карты при размонтировании компонента
  }, []);



  const handleSubmit = async () =>{
    const arrayAdress = address.split(",")
    const adress = arrayAdress[0].includes("улица") ? arrayAdress[0] : arrayAdress[1];
    const specialName = !arrayAdress[0].includes("улица") ? arrayAdress[0] : "Бурабай"
    const response = await apiService.post({
      url: "/address",
      dto:{
        organizationId: user?.organization.id,
        adId: props.adId,
        address: address,
        latitude: coords[0],
        longitude: coords[1],
        specialName 
      }
      
      
    })
    if(response.data == HTTP_STATUS.CREATED){
      navigate({
        to: "/announcements/addAnnouncements/step-five"
      })
    }
  }

  return (
    <main className="min-h-screen">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={async () => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align="center">
              {t("addNewAd")}
            </Typography>
            <Typography size={14} weight={400} color={COLORS_TEXT.blue200} align="center">
              {t("choisePlace")}
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
        <div>
        <TextField
        variant='outlined'
        placeholder={t("addressPlace")}
          style={{
            width: "80%",
            position: 'absolute',
            top: 105,
            left: 55,

          }}
        />
          <Typography>Адрес:</Typography> {address}


        </div>
      )}
      <div className="fixed left-0 bottom-6 mb-2 mt-2 px-2 w-full">
        <Button
          onClick={handleSubmit}
          mode="default"
        >
          {t("continueBtn")}
        </Button>
      </div>
    </main>
  );
};

import { FC, useState, useEffect } from "react";
import { Map, View } from "ol";
import "ol/ol.css";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Tile as TileLayer } from "ol/layer";
import { XYZ } from "ol/source";
import { fromLonLat, toLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import location from "../../app/icons/main/markerMap.png";
import { Typography } from "../../shared/ui/Typography";
import { Header } from "../../components/Header";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import { ProgressSteps } from "../announcements/ui/ProgressSteps";
import { apiService } from "../../services/api/ApiService";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../features/auth";
import { Modal, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Announcement } from "../announcements/model/announcements";

const containerStyle = {
  width: "100%",
  height: "90vh",
};

interface Props {
  adId: string;
  announcement?: Announcement;
}

const initialCenter = [70.31, 53.08]; // Координаты для Борового

export const MapComponent: FC<Props> = ({ adId, announcement }) => {
  const googleMapsApiKey = import.meta.env.VITE_GOOGLEMAP_API_KEY;
  const googleMapsLayer = new TileLayer({
    source: new XYZ({
      url: `https://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en&gl=en&key=${googleMapsApiKey}`,
    }),
  });
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [address, setAddress] = useState<string>(
    announcement?.address?.address || ""
  ); // Храним адрес

  const [coords, setCoords] = useState<number[]>(
    announcement?.address?.latitude && announcement?.address?.longitude
      ? [announcement.address.latitude, announcement.address.longitude]
      : []
  );
  useEffect(() => {
    let currentMarker: Feature | null =
      announcement?.address?.latitude && announcement?.address?.longitude
        ? new Feature({
            geometry: new Point(
              fromLonLat([
                announcement?.address.latitude,
                announcement?.address.longitude,
              ])
            ),
          })
        : null;

    const vectorSource = new VectorSource();
    if (currentMarker) {
      currentMarker.setStyle(
        new Style({
          image: new Icon({
            src: location,
            scale: 0.75,
          }),
        })
      );
      vectorSource.addFeature(currentMarker); // Добавляем новый маркер в источник
    }
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: "map",
      layers: [googleMapsLayer, vectorLayer],
      view: new View({
        center: fromLonLat(initialCenter),
        zoom: 14,
      }),
      controls: [],
    });

    map.on("click", async (e) => {
      const coordinates = e.coordinate; // Получаем координаты клика
      const [lng, lat] = toLonLat(coordinates); // Переводим координаты в долготу и широту
      setCoords(toLonLat(coordinates));

      if (!currentMarker) {
        // Если маркер отсутствует, создаем новый
        currentMarker = new Feature({
          geometry: new Point(coordinates),
        });
        currentMarker.setStyle(
          new Style({
            image: new Icon({
              src: location,
              scale: 0.75,
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

        // Получение улицы и дома из объекта address
        const street = address?.road || ""; // Улица
        const houseNumber = address?.house_number || ""; // Номер дома

        const fullAddress = `${street} ${houseNumber}`.trim(); // Формируем полный адрес

        setAddress(fullAddress || display_name); // Устанавливаем полный адрес или "display_name" как fallback
      } catch (error) {
        console.error("Ошибка при получении адреса:", error);
      }
    });

    return () => map.setTarget(undefined); // Очистка карты при размонтировании компонента
  }, []);

  const handleSubmit = async () => {
    if (announcement?.address) {
      const response = await apiService.patch<string>({
        url: `/address/${announcement.address.id}`,
        dto: {
          adId: adId,
          address: address,
          latitude: coords[0],
          longitude: coords[1],
          specialName: address,
        },
      });
      if (response.data) {
        //TODO Сделать навигацию на следующий шаг редактирования
        navigate({
          to: "/announcements/addAnnouncements/step-five/$id",
          params: {
            id: adId,
          },
        });
      }
    } else {
      const response = await apiService.post({
        url: "/address",
        dto: {
          organizationId: user?.organization?.id,
          adId: adId,
          address: address,
          latitude: coords[0],
          longitude: coords[1],
          specialName: address,
        },
      });
      // XXX поменял проверку со статусв на response.data
      if (response.data) {
        navigate({
          to: "/announcements/addAnnouncements/step-five/$id",
          params: {
            id: adId,
          },
        });
      }
    }
  };

  return (
    <main className="min-h-screen">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer
            align="start"
            action={async () => {
              if (announcement?.title) {
                navigate({
                  to: "/announcements/edit/choiseDetails/$adId",
                  params: {
                    adId: announcement?.id,
                  },
                });
              } else {
                history.back();
              }
            }}
          >
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {announcement?.address ? t("changeAd") : t("addNewAd")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("choisePlace")}
            </Typography>
          </div>
          <IconContainer align="end" action={() => setShowModal(true)}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={4} totalSteps={9}></ProgressSteps>
      </Header>
      {showModal && (
        <Modal
          className="flex w-full h-full justify-center items-center p-4"
          open={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="relative w-full flex flex-col bg-white p-4 rounded-lg">
            <Typography
              size={16}
              weight={400}
              className="text-center w-4/5 mx-auto"
            >
              {t("confirmDelete")}
            </Typography>
            <div
              onClick={() => setShowModal(false)}
              className="absolute right-0 top-0 p-4"
            >
              <img src={XIcon} className="w-[15px]" alt="" />
            </div>
            <div className="flex flex-col w-full px-4 justify-center mt-4">
              <Button
                className="mb-2"
                onClick={() =>
                  navigate({
                    to: "/announcements",
                  })
                }
              >
                {t("publish")}
              </Button>
              <Button
                mode="red"
                className="border-2 border-red"
                onClick={async () => {
                  await apiService.delete({
                    url: `/ad/${adId}`,
                  });
                  navigate({
                    to: "/announcements",
                  });
                }}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="z-10" id="map" style={containerStyle}></div>
      {address && (
        <div>
          <TextField
            value={address}
            label={t("adressService")}
            variant="outlined"
            placeholder={t("addressPlace")}
            style={{
              width: "80%",
              height: "69px",
              position: "absolute",
              top: 105,
              left: 55,
              zIndex: 2,
            }}
          />
        </div>
      )}
      <div className="fixed left-0 bottom-6 mb-2 mt-2 px-2 w-full z-10">
        <Button
          onClick={handleSubmit}
          mode="default"
          disabled={coords.length === 0}
        >
          {t("continueBtn")}
        </Button>
      </div>
    </main>
  );
};

import React, { FC, useState, useEffect, useRef } from "react";
import "ol/ol.css";
import { Typography } from "../../shared/ui/Typography";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import SearchIcon from "../../app/icons/search-icon.svg";
import { DirectionsRenderer } from "@react-google-maps/api";
import {
  Announcement,
  Category,
  Schedule,
} from "../announcements/model/announcements";
import BackIcon from "../../app/icons/back-icon.svg";
import {
  categoryBgColors,
  categoryColors,
  COLORS_TEXT,
} from "../../shared/ui/colors";
import cancel from "../../app/icons/announcements/xCancel.svg";
import { baseUrl } from "../../services/api/ServerData";
import defaultImage from "../../app/icons/abstract-bg.svg";
import defaultAnnoun from "../../app/icons/abstract-bg.svg";
import ellipse from "../../app/icons/announcements/ellipseMalenkiy.svg";
import star from "../../app/icons/announcements/StarYellow.svg";
import FavouriteIcon from "../../app/icons/favourite.svg";
import FavouriteActiveIcon from "../../app/icons/favourite-active.svg";
import { Button } from "../../shared/ui/Button";
import cancelBlack from "../../app/icons/announcements/xCancel-Black.svg";
import { CoveredImage } from "../../shared/ui/CoveredImage";
import { useNavigate } from "@tanstack/react-router";
import { MapFilter } from "../announcements/announcements-utils";
import { useTranslation } from "react-i18next";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  MarkerClusterer,
} from "@react-google-maps/api";
import { ROLE_TYPE } from "../auth/model/auth-model";
import { apiService } from "../../services/api/ApiService";
import { queryClient } from "../../ini/InitializeApp";
import { roleService } from "../../services/storage/Factory";

// Встраиваем SVG иконки категорий напрямую для использования в маркерах
const categoryIconSvgMap: Record<string, { svg: string; viewBox: string }> = {
  Отдых: {
    svg: `<path d="M14.6052 32.5807H20.0719C20.1271 32.5807 20.1719 32.536 20.1719 32.4807V26.9141H22.5861C25.2202 26.9141 27.8478 26.6539 30.4307 26.1373L32.6299 25.6974C33.0375 25.6159 33.1735 25.1016 32.8593 24.8293L23.1594 16.4227C23.0966 16.3682 23.1237 16.2654 23.2053 16.2491L29.2014 15.0498C29.5871 14.9727 29.7368 14.5011 29.4664 14.2157L17.7015 1.7972C17.5043 1.58903 17.1728 1.58903 16.9756 1.7972L5.21072 14.2157C4.94026 14.5011 5.09002 14.9727 5.47564 15.0498L11.4718 16.2491C11.5533 16.2654 11.5805 16.3682 11.5177 16.4227L1.79743 24.8469C1.48702 25.1159 1.61545 25.6237 2.01643 25.7129L3.13554 25.9615C5.98454 26.5947 8.89427 26.9141 11.8128 26.9141H14.5052V32.4807C14.5052 32.536 14.55 32.5807 14.6052 32.5807Z" stroke="#39B598" stroke-width="1.5" fill="none"/>`,
    viewBox: "0 0 34 34",
  },

  Жилье: {
    svg: `<g><path d="M32.5807 32.4807V16.1641C32.5807 15.0595 31.6853 14.1641 30.5807 14.1641H3.41406C2.30949 14.1641 1.41406 15.0595 1.41406 16.1641V32.4807C1.41406 32.536 1.45883 32.5807 1.51406 32.5807H6.98073C7.03596 32.5807 7.08073 32.536 7.08073 32.4807V26.9141H26.9141V32.4807C26.9141 32.536 26.9588 32.5807 27.0141 32.5807H32.4807C32.536 32.5807 32.5807 32.536 32.5807 32.4807Z" stroke="#5EBAE1" stroke-width="1.5" fill="none"/><path d="M4.25 2.41406V14.1641H29.75V2.41406C29.75 1.86178 29.3023 1.41406 28.75 1.41406H5.25C4.69772 1.41406 4.25 1.86178 4.25 2.41406Z" stroke="#5EBAE1" stroke-width="1.5" fill="none"/><path d="M8.5 9.5V14.1667H25.5V9.5C25.5 8.94772 25.0523 8.5 24.5 8.5H9.5C8.94772 8.5 8.5 8.94771 8.5 9.5Z" stroke="#5EBAE1" stroke-width="1.5" fill="none"/></g>`,
    viewBox: "0 0 34 34",
  },

  Здоровье: {
    svg: `<g><path d="M10.5387 10.9952L16.8332 1.94695C16.9128 1.83256 17.082 1.83257 17.1616 1.94695L23.456 10.9952C26.3743 15.1903 26.3157 20.7732 23.31 24.9061L22.6641 25.7943L17.1591 33.3635C17.0793 33.4734 16.9155 33.4734 16.8356 33.3635L11.3307 25.7943L10.6848 24.9061C7.67908 20.7732 7.62047 15.1903 10.5387 10.9952Z" stroke="#DC53AD" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M17 33.5833L21.577 31.9475C28.3411 29.5301 32.8559 23.1222 32.8559 15.9392V11.1743C32.8559 10.9675 32.6414 10.8303 32.4536 10.9171L24.7917 14.4583" stroke="#DC53AD" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M17.0043 33.5833L12.4273 31.9475C5.66316 29.5301 1.14844 23.1222 1.14844 15.9392L1.14844 11.1743C1.14844 10.9675 1.36288 10.8303 1.55064 10.9171L9.21262 14.4583" stroke="#DC53AD" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M11.3364 8.78998L7.28967 5.41763C7.1877 5.33266 7.03277 5.36876 6.97886 5.49005L4.25303 11.6233" stroke="#DC53AD" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M22.6641 8.78932L26.626 5.48763C26.7705 5.36725 26.99 5.41839 27.0663 5.59021L29.7474 11.6226" stroke="#DC53AD" stroke-width="1.5" stroke-linecap="round" fill="none"/></g>`,
    viewBox: "0 0 34 34",
  },

  Экстрим: {
    svg: `<g><path d="M14.8828 31.5859C14.8828 32.1382 14.4351 32.5859 13.8828 32.5859H8.79948C8.24719 32.5859 7.79948 32.1382 7.79948 31.5859V27.6276H14.8828V31.5859Z" stroke="#EF5C7F" stroke-width="2" fill="none"/><path d="M21.2552 10.24C21.2552 16.108 15.5885 22.3828 11.3385 22.3828C7.08854 22.3828 1.42188 16.108 1.42188 10.24C1.42188 4.37193 5.86172 1.13281 11.3385 1.13281C16.8154 1.13281 21.2552 4.37193 21.2552 10.24Z" stroke="#EF5C7F" stroke-width="2" fill="none"/><path d="M15.5859 9.63281C15.5859 15.1096 13.6831 22.3828 11.3359 22.3828C8.98873 22.3828 7.08594 15.1096 7.08594 9.63281C7.08594 4.15599 8.98873 1.13281 11.3359 1.13281C13.6831 1.13281 15.5859 4.15599 15.5859 9.63281Z" stroke="#EF5C7F" stroke-width="2" fill="none"/><path d="M3.54688 17L7.79687 27.625H14.8802L19.1302 17" stroke="#EF5C7F" stroke-width="2" stroke-linecap="round" fill="none"/></g>`,
    viewBox: "0 0 22 34",
  },

  Достопримечательности: {
    svg: `<g><path d="M30.0859 14.1641C30.0859 23.2084 19.4804 31.4278 17.6146 32.8039C17.4454 32.9287 17.2264 32.9287 17.0573 32.8039C15.1914 31.4278 4.58594 23.2084 4.58594 14.1641C4.58594 7.12243 10.2943 1.41406 17.3359 1.41406C24.3776 1.41406 30.0859 7.12243 30.0859 14.1641Z" stroke="#B49081" stroke-width="2" fill="none"/><path d="M17.2436 5.88606C17.2778 5.80393 17.3941 5.80393 17.4283 5.88606L19.5608 11.0132C19.5752 11.0478 19.6077 11.0715 19.6451 11.0745L25.1803 11.5182C25.2689 11.5253 25.3049 11.636 25.2373 11.6938L21.0201 15.3063C20.9916 15.3307 20.9792 15.369 20.9879 15.4055L22.2763 20.8068C22.297 20.8934 22.2028 20.9617 22.1269 20.9154L17.3881 18.0209C17.3561 18.0014 17.3158 18.0014 17.2838 18.0209L12.5449 20.9154C12.469 20.9617 12.3749 20.8934 12.3955 20.8068L13.684 15.4055C13.6927 15.369 13.6802 15.3307 13.6518 15.3063L9.43455 11.6938C9.367 11.636 9.40295 11.5253 9.49162 11.5182L15.0268 11.0745C15.0642 11.0715 15.0967 11.0478 15.1111 11.0132L17.2436 5.88606Z" stroke="#B49081" stroke-width="2" fill="none"/></g>`,
    viewBox: "0 0 34 34",
  },

  Питание: {
    svg: `<g><path d="M11.2995 15.1111L12.4427 26.6954C12.6182 28.4743 12.1022 30.2525 11.0017 31.6611C10.0734 32.8494 8.2756 32.8494 7.34723 31.6611C6.24674 30.2525 5.73075 28.4743 5.9063 26.6954L7.04948 15.1111L6.81915 14.9146C4.74318 13.1431 3.6594 10.472 3.91413 7.75481C4.10849 5.68168 5.06737 3.75507 6.60411 2.35005L6.76205 2.20565C8.12792 0.956855 10.221 0.956853 11.5869 2.20565L11.7448 2.35005C13.2816 3.75507 14.2405 5.68168 14.4348 7.75481C14.6896 10.472 13.6058 13.1431 11.5298 14.9146L11.2995 15.1111Z" stroke="#F4A261" stroke-width="2" fill="none"/><path d="M33.2552 2.83594V7.48768C33.2552 10.4089 31.9754 13.1836 29.7532 15.0798C29.7284 15.101 29.7155 15.133 29.7187 15.1655L30.8567 26.6979C31.0323 28.4768 30.5163 30.255 29.4158 31.6637C28.4874 32.852 26.6897 32.852 25.7613 31.6637C24.6608 30.255 24.1448 28.4768 24.3204 26.6979L25.4584 15.1655C25.4616 15.133 25.4487 15.101 25.4239 15.0798C23.2017 13.1836 21.9219 10.4089 21.9219 7.48768V2.83594M27.5859 1.41406V10.6224" stroke="#F4A261" stroke-width="2" stroke-linecap="round" fill="none"/></g>`,
    viewBox: "0 0 34 34",
  },

  Развлечения: {
    svg: `<g><path d="M2.08594 29.3359C2.08594 28.7837 2.53365 28.3359 3.08594 28.3359H32.2526C32.8049 28.3359 33.2526 28.7837 33.2526 29.3359V31.5859C33.2526 32.1382 32.8049 32.5859 32.2526 32.5859H3.08594C2.53365 32.5859 2.08594 32.1382 2.08594 31.5859V29.3359Z" stroke="#E5C82F" stroke-width="2" fill="none"/><path d="M14.8359 12.0391H20.5026V28.3307H14.8359V12.0391Z" stroke="#E5C82F" stroke-width="2" fill="none"/><path d="M2.08594 6.65839C2.08594 6.589 2.15489 6.5407 2.22011 6.56442L8.51063 8.85188C9.39366 9.17298 10.3615 9.17298 11.2446 8.85188L16.3023 7.01271C17.1853 6.6916 18.1532 6.6916 19.0362 7.01271L24.094 8.85188C24.977 9.17298 25.9449 9.17298 26.8279 8.85188L33.1184 6.56442C33.1836 6.5407 33.2526 6.589 33.2526 6.6584V11.1823C33.2526 11.7346 32.8049 12.1823 32.2526 12.1823H3.08594C2.53365 12.1823 2.08594 11.7346 2.08594 11.1823V6.65839Z" stroke="#E5C82F" stroke-width="2" fill="none"/><path d="M2.48132 6.46175C2.3783 6.47646 2.36349 6.61916 2.46129 6.65472L5.98177 7.9349L8.51063 8.85448C9.39366 9.17558 10.3615 9.17558 11.2446 8.85448L16.3023 7.01531C17.1853 6.69421 18.1532 6.69421 19.0362 7.01531L24.094 8.85448C24.977 9.17558 25.9449 9.17558 26.8279 8.85448L32.8856 6.65167C32.9829 6.6163 32.969 6.47459 32.8667 6.45885L26.2304 5.43788C24.7904 5.21635 23.4162 4.68283 22.2039 3.87467L18.258 1.24402C17.9052 1.00884 17.4424 1.02168 17.1033 1.27607L14.0522 3.56438C12.7075 4.57288 11.1303 5.22617 9.46639 5.46388L2.48132 6.46175Z" stroke="#E5C82F" stroke-width="2" fill="none"/><path d="M7.75781 12.75V18.4167M27.5859 12.75V18.4167" stroke="#E5C82F" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M30.4219 24.0859H24.7552V20.4193C24.7552 19.3147 25.6506 18.4193 26.7552 18.4193H28.4219C29.5264 18.4193 30.4219 19.3147 30.4219 20.4193V24.0859Z" stroke="#E5C82F" stroke-width="2" fill="none"/><path d="M10.5859 24.0859H4.91927V20.4193C4.91927 19.3147 5.8147 18.4193 6.91927 18.4193H8.58594C9.69051 18.4193 10.5859 19.3147 10.5859 20.4193V24.0859Z" stroke="#E5C82F" stroke-width="2" fill="none"/></g>`,
    viewBox: "0 0 34 34",
  },

  Прокат: {
    svg: `<path d="M24.3256 16.3548L24.4657 16.4051L24.4593 16.2563C24.4221 15.3999 24.2497 14.5497 23.9435 13.7413C23.3045 12.055 22.1235 10.6586 20.6076 9.79288C19.0919 8.92732 17.3361 8.64625 15.6445 8.99744L13.7958 9.38122L12.3857 1.90823L14.2278 1.5258C17.5924 0.827301 21.0836 1.38692 24.0947 3.10648C27.1056 4.8259 29.4455 7.59581 30.7101 10.9336C31.6705 13.4682 31.9651 16.2096 31.5859 18.8769L31.5744 18.9576L31.6511 18.9851L32.4955 19.2884C33.931 19.8038 34.271 21.7504 33.1216 22.767L23.7885 31.022L20.5209 14.9886L24.3256 16.3548ZM26.2293 19.096L26.1806 19.2931L23.4652 18.3181L23.2979 18.2581L23.3334 18.4322L25.0554 26.8817L25.09 27.0513L25.2197 26.9366L31.5171 21.3667L31.6436 21.2547L31.4846 21.1977L29.1641 20.3644L29.2079 20.2014C29.9587 17.408 29.8144 14.4274 28.7892 11.7214C27.7002 8.84733 25.6869 6.46607 23.1009 4.98928C21.0089 3.7946 18.6484 3.25247 16.2946 3.40625C15.8316 3.4365 15.3689 3.49367 14.9085 3.5781L14.8097 3.59623L14.8283 3.69497L15.4051 6.75749L15.4234 6.8545L15.5206 6.83748C17.6026 6.47317 19.7439 6.84929 21.6014 7.91008C23.5422 9.0184 25.0498 10.8034 25.8644 12.9536C26.3886 14.3369 26.6048 15.8158 26.5101 17.2801C26.4706 17.8905 26.3771 18.4984 26.2293 19.096ZM18.5104 24.2224L20.359 23.8386L21.7691 31.3116L19.927 31.694C16.5625 32.3925 13.0713 31.8329 10.0601 30.1133C7.04924 28.3939 4.70938 25.624 3.44474 22.2862C2.48637 19.7567 2.191 17.0214 2.5667 14.3593L2.57808 14.2787L2.50148 14.2512L1.61104 13.9314C0.175616 13.416 -0.164421 11.4694 0.985036 10.4528L10.3181 2.19783L13.5857 18.2312L9.8301 16.8827L9.6896 16.8322L9.69641 16.9813C9.73521 17.8317 9.90727 18.6757 10.2114 19.4785C10.8504 21.1648 12.0313 22.5612 13.5473 23.4269C15.063 24.2925 16.8188 24.5735 18.5104 24.2224ZM7.97008 13.9425L10.6414 14.9017L10.8087 14.9617L10.7732 14.7876L9.05117 6.33809L9.0166 6.16847L8.88694 6.28316L2.5895 11.8531L2.46295 11.965L2.62195 12.0221L4.98634 12.8711L4.94276 13.0341C4.19672 15.8229 4.34236 18.7975 5.36572 21.4984C6.45465 24.3725 8.46793 26.7537 11.054 28.2305C13.146 29.4252 15.5065 29.9673 17.8603 29.8135C18.3236 29.7833 18.7867 29.726 19.2475 29.6415L19.3463 29.6233L19.3277 29.5246L18.7499 26.4623L18.7316 26.3653L18.6344 26.3823C16.5523 26.7466 14.411 26.3705 12.5534 25.3097C10.6126 24.2014 9.10508 22.4164 8.29044 20.2662C7.76835 18.8883 7.55175 17.4156 7.64365 15.9569C7.68213 15.3463 7.77468 14.738 7.92155 14.1401L7.97008 13.9425Z" fill="#A16ACD" stroke="white" stroke-width="0.5"/>`,
    viewBox: "0 0 34 34",
  },

  Безопасность: {
    svg: `<g><path d="M4.92188 7.7306C4.92188 7.33541 5.15461 6.97729 5.51574 6.81679L16.8596 1.77507C17.3767 1.54524 17.967 1.54524 18.4842 1.77507L29.828 6.81679C30.1891 6.97729 30.4219 7.33541 30.4219 7.7306V18.7291C30.4219 22.0726 28.7509 25.1949 25.9689 27.0496L17.7273 32.5439C17.6938 32.5663 17.65 32.5663 17.6164 32.5439L9.37488 27.0496C6.59289 25.1949 4.92188 22.0726 4.92188 18.7291V7.7306Z" stroke="#777CEF" stroke-width="2" fill="none"/><path d="M10.5859 10.4986C10.5859 10.4568 10.6119 10.4195 10.651 10.4049L17.32 7.91923C17.5453 7.83527 17.7933 7.83527 18.0185 7.91923L24.6875 10.4049C24.7267 10.4195 24.7526 10.4568 24.7526 10.4986V18.6441C24.7526 20.2757 23.9565 21.8046 22.6199 22.7403L17.7266 26.1656C17.6922 26.1897 17.6464 26.1897 17.6119 26.1656L12.7186 22.7403C11.382 21.8046 10.5859 20.2757 10.5859 18.6441V10.4986Z" stroke="#777CEF" stroke-width="2" fill="none"/></g>`,
    viewBox: "0 0 34 34",
  },
};

const containerStyle = {
  width: "100%",
  height: "86vh",
};

interface Props {
  announcements: Announcement[];
  categories: Category[];
  filters: MapFilter;
}

export const MapNav: FC<Props> = ({ announcements, categories, filters }) => {
  const [center, _setCenter] = useState({
    lat: 53.08271195503471,
    lng: 70.30456742278163,
  });
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLEMAP_API_KEY, // Замените на ваш ключ API
  });
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(
    null
  );

  useEffect(() => {
    if (window.google && window.google?.maps?.TravelMode) {
      setTravelMode(google.maps.TravelMode.DRIVING);
    }
    if (location.href.includes("#")) {
      const hash = window.location.hash;
      handleMarkerClick(hash.substring(1));
    }
  }, []);
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
  };

  const [zoom, setZoom] = useState<number>(10);
  const [isLocationDenied, setIsLocationDenied] = useState(false);
  const role = roleService.hasValue() ? roleService.getValue() : null;
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocationDenied(false); // Если доступ есть, сбрасываем флаг отказа
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setIsLocationDenied(true); // Если юзер отказался, показываем модалку
          } else {
            setUserLocation({ lat: 52.2833, lng: 76.9667 }); // Фолбэк, если ошибка другая
          }
        }
      );
    } else {
      setUserLocation({ lat: 52.2833, lng: 76.9667 }); // Фолбэк, если браузер не поддерживает гео
    }
  }, []);

  // Обработчики для горизонтального скролла категорий на iOS
  useEffect(() => {
    const container = categoriesScrollRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
      scrollLeftRef.current = container.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartXRef.current) return;

      const touchX = e.touches[0].clientX;
      const diff = touchStartXRef.current - touchX;
      container.scrollLeft = scrollLeftRef.current + diff;

      // Предотвращаем вертикальный скролл страницы при горизонтальном скролле
      if (Math.abs(diff) > 5) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      touchStartXRef.current = 0;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const calculateRoute = async (latitude: number, longitude: number) => {
    if (!userLocation) {
      return;
    }
    if (!isLoaded || !window.google || !window.google.maps) {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: userLocation,
        destination: { lat: longitude, lng: latitude },
        travelMode: travelMode || google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
    } catch (error) {}
  };

  const { t } = useTranslation();
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
  const [isSearchResultFound, setIsSearchResultFound] = useState(false);
  const [announcementsName, setAnnouncementsName] = useState<string>(
    filters.adName || ""
  );
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [_categoryInfo, _setCategoryInfo] = useState<string>("");
  const navigate = useNavigate();
  const [showAnnouncementModal, setShowAnnouncementModal] =
    useState<boolean>(false); // Для отображения модального окна с объявлением
  const [announcementInfo, setAnnouncementInfo] = useState<Announcement | null>(
    null
  ); // Храним информацию о выбранном объявлении

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (announcementsName.length > 0) {
        const foundAnnouncement = announcements.some((announcement) =>
          announcement.title
            .toLowerCase()
            .includes(announcementsName.toLowerCase())
        );
        setIsSearchResultFound(foundAnnouncement);
        navigate({
          to: "/mapNav/search/$value",
          params: {
            value: announcementsName,
          },
        });
      } else {
        navigate({
          to: "/mapNav",
          search: {
            categoryNames: "",
            adName: "",
          },
        });
      }
    }
  };

  useEffect(() => {
    setActiveCategory(filters?.categoryNames || "");
  }, []);

  const loadImage = (imgPath: string | undefined) => {
    return imgPath ? baseUrl + imgPath : defaultImage;
  };

  const handleCloseModal = () => {
    setSelectedMarker(null);
    setShowCategoryModal(false);
    setShowAnnouncementModal(false);
  };

  // Создаем переменную для отслеживания уже отображенных категорий
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const handleMarkerClick = (announcementId: string) => {
    setSelectedMarker(announcementId);

    const selectedAnnouncement = announcements.find(
      (announcement) => announcement.id === announcementId
    );

    if (selectedAnnouncement) {
      setAnnouncementInfo(selectedAnnouncement);
      setIsFavourite(selectedAnnouncement.isFavourite);
      setShowAnnouncementModal(true);

      if (
        selectedAnnouncement.address?.latitude &&
        selectedAnnouncement.address?.longitude &&
        mapRef.current
      ) {
        mapRef.current.panTo({
          lat: selectedAnnouncement.address.longitude,
          lng: selectedAnnouncement.address.latitude,
        });
      }
      location.href = `#${announcementId}`;
    }
  };

  const { start, end } = getCurrentDaySchedule(announcementInfo);
  // Получаем текущую дату и время
  const currentTime = new Date();

  // Извлекаем из строки времени end только часы и минуты
  const [hours, minutes] = end?.split(":").map(Number) || [0, 0];

  // Создаем объект Date для времени закрытия, где устанавливаем только часы и минуты
  let closingTime = new Date();
  closingTime.setHours(hours, minutes, 0, 0); // Устанавливаем время в объекте Date

  // Проверяем, если время закрытия меньше текущего времени, то заведение закрыто
  const isClosed =
    hours == 0 && minutes == 0 ? false : closingTime < currentTime;
  const openLocationSettings = () => {
    if (/android/i.test(navigator.userAgent)) {
      // Открыть настройки геолокации на Android
      window.location.href =
        "intent://settings#Intent;scheme=android.settings.LOCATION_SOURCE_SETTINGS;end";
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Открыть настройки приложения на iOS
      window.location.href = "app-settings:";
    } else {
      alert("Откройте настройки вручную и разрешите доступ к геолокации.");
    }
  };
  const [isFavourite, setIsFavourite] = useState<boolean>(false);

  // Синхронизируем isFavourite с announcementInfo
  useEffect(() => {
    if (announcementInfo) {
      console.log("Обновление isFavourite из announcementInfo:", {
        announcementId: announcementInfo.id,
        isFavourite: announcementInfo.isFavourite,
      });
      setIsFavourite(announcementInfo.isFavourite);
    }
  }, [announcementInfo]);

  const addToFavourite = async () => {
    if (announcementInfo) {
      await apiService.get({
        url: `/ad/favorite/${announcementInfo.id}`,
      });
      const newFavouriteState = !isFavourite;
      console.log("Переключение избранного:", {
        announcementId: announcementInfo.id,
        oldState: isFavourite,
        newState: newFavouriteState,
      });
      setIsFavourite(newFavouriteState);

      // Обновляем состояние announcementInfo чтобы сохранить актуальное значение
      setAnnouncementInfo({
        ...announcementInfo,
        isFavourite: newFavouriteState,
      });

      // Обновляем данные карты
      await queryClient.refetchQueries({ queryKey: ["/map"] });
      await queryClient.refetchQueries({ queryKey: ["ad/favorite/list"] });
      await queryClient.refetchQueries({
        queryKey: ["main-page-announcements"],
      });
    }
  };
  useEffect(() => {
    if (!isLoaded || !mapReady || (!filters.adId && !filters.adName)) return;

    const selectedAnnouncement = announcements.find(
      (announcement) => announcement.id === filters.adId
    );

    const selectedByName = announcements.find(
      (announcement) =>
        filters.adName &&
        announcement.title.toLowerCase().includes(filters.adName.toLowerCase())
    );

    if (selectedAnnouncement && mapRef.current) {
      setAnnouncementInfo(selectedAnnouncement);
      setShowAnnouncementModal(true);
      setSelectedMarker(selectedAnnouncement.id);

      mapRef.current.panTo({
        lat: selectedAnnouncement.address.longitude,
        lng: selectedAnnouncement.address.latitude,
      });
    } else if (selectedByName && mapRef.current) {
      setAnnouncementInfo(selectedByName);
      setShowAnnouncementModal(true);
      setSelectedMarker(selectedByName.id);

      mapRef.current.panTo({
        lat: selectedByName.address.longitude,
        lng: selectedByName.address.latitude,
      });
    }
  }, [filters.adId, filters.adName, announcements, isLoaded, mapReady]);
  useEffect(() => {
    if (announcements.length > 0 && !selectedMarker) {
      setSelectedMarker(announcements[0].id); // Выбираем первый маркер по умолчанию
    }
  }, [announcements, selectedMarker]);

  return (
    <main className="min-h-screen">
      <Header pb="0" className="">
        <div className="flex justify-between items-center text-center w-full pb-2">
          <div className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1 shadow-sm">
            <img src={SearchIcon} />
            <input
              type="text"
              placeholder={t("adSearch")}
              onChange={(e) => setAnnouncementsName(e.target.value)}
              value={announcementsName}
              className="flex-grow bg-transparent outline-none "
            />
            {announcementsName && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setAnnouncementsName("");
                }}
                className="flex-shrink-0"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#0a7d9e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </Header>

      {isLoaded ? (
        <GoogleMap
          onZoomChanged={() => {
            if (mapRef.current) {
              setZoom(mapRef.current.getZoom() ?? 10);
            }
          }}
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            streetViewControl: false,
            rotateControl: false,
            tilt: 0,
            gestureHandling: "greedy",
          }}
          onLoad={handleMapLoad}
        >
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          <MarkerClusterer
            options={{
              maxZoom: 15,
              minimumClusterSize: 3,
              gridSize: 60,
              styles: [
                {
                  url: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%230A7D9E' opacity='0.85'/%3E%3C/svg%3E",
                  height: 40,
                  width: 40,
                  textColor: "white",
                  textSize: 14,
                },
                {
                  url: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='23' fill='%230A7D9E' opacity='0.85'/%3E%3C/svg%3E",
                  height: 50,
                  width: 50,
                  textColor: "white",
                  textSize: 15,
                },
                {
                  url: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='28' fill='%230A7D9E' opacity='0.85'/%3E%3C/svg%3E",
                  height: 60,
                  width: 60,
                  textColor: "white",
                  textSize: 16,
                },
              ],
            }}
          >
            {(clusterer) => (
              <>
                {announcements.map((announcement, index) => {
                  if (
                    !announcement.address ||
                    !announcement.address.latitude ||
                    !announcement.address.longitude
                  ) {
                    return null;
                  }

                  const isSelected = selectedMarker === announcement.id;
                  const categoryName = announcement.subcategory?.category?.name;
                  const categoryColor =
                    categoryColors[categoryName] || "#39B598";
                  const iconData = categoryIconSvgMap[categoryName];

                  // Создаем маркер со встроенной SVG иконкой категории
                  const createMarkerSvg = (
                    color: string,
                    iconData: { svg: string; viewBox: string } | undefined
                  ) => {
                    // Весь маркер 52x52, цветной фон 39x49, круг 28x28, иконка 16x16
                    // Центрируем иконку по центру белого круга (26, 17.5)
                    const iconElement = iconData
                      ? `<svg x="18" y="9.5" width="16" height="16" viewBox="${iconData.viewBox}">${iconData.svg}</svg>`
                      : `<circle cx="26" cy="17.5" r="3" fill="${color}"/>`;

                    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
          </defs>
          <g transform="translate(6.5, 1.5)">
            <path d="M34.125 16.005C34.125 26.361 21.609 35.73 19.6915 37.0916C19.5345 37.2064 19.3291 37.2064 19.1721 37.0916C17.2545 35.73 4.73828 26.361 4.73828 16.005C4.73828 8.06895 10.9599 1.625 19.4318 1.625C27.9037 1.625 34.125 8.06895 34.125 16.005Z" fill="${color}" filter="url(#shadow)"/>
            <circle cx="19.5" cy="16" r="11" fill="white"/>
          </g>
          ${iconElement}
        </svg>`)}`;
                  };

                  const svgLocationWithIcon = createMarkerSvg(
                    categoryColor,
                    iconData
                  );

                  return (
                    <Marker
                      key={announcement.id}
                      position={{
                        lat: announcement.address.longitude,
                        lng: announcement.address.latitude,
                      }}
                      clusterer={clusterer}
                      icon={{
                        url: svgLocationWithIcon,
                        scaledSize: new google.maps.Size(
                          isSelected ? 65 : 52,
                          isSelected ? 65 : 52
                        ),
                        anchor: new google.maps.Point(
                          isSelected ? 32.5 : 26,
                          isSelected ? 60 : 48
                        ),
                      }}
                      zIndex={isSelected ? 999 : index}
                      onClick={() => handleMarkerClick(announcement.id)}
                    />
                  );
                })}
              </>
            )}
          </MarkerClusterer>
        </GoogleMap>
      ) : (
        <div>
          <Typography size={16} weight={600}>
            {"Загрузка"}
          </Typography>
        </div>
      )}

      <div
        className="absolute bottom-20 left-0 right-0 z-[999]"
        style={{ pointerEvents: "none" }}
      >
        <div
          ref={categoriesScrollRef}
          className="overflow-x-auto overflow-y-hidden px-4 py-2 hide-scrollbar ios-scrollable-area"
          style={{
            WebkitOverflowScrolling: "touch",
            pointerEvents: "auto",
            overscrollBehavior: "contain",
            touchAction: "pan-x",
          }}
        >
          <div
            className="flex gap-2"
            style={{ width: "max-content", minWidth: "min-content" }}
          >
            {!isSearchResultFound &&
              categories.map((item) => {
                return (
                  <button
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/mapNav",
                        search: {
                          categoryNames: filters.categoryNames
                            ?.split(",")
                            .includes(item.name)
                            ? (filters?.categoryNames
                                ?.split(",")
                                .filter((cat) => cat != item.name)
                                .join(",") ?? "")
                            : filters.categoryNames
                              ? filters.categoryNames + "," + item.name
                              : item.name,
                          adName: filters.adName,
                        },
                      })
                    }
                    key={item.id}
                    className={`flex-shrink-0 whitespace-nowrap rounded-full flex items-center p-1 pr-4 gap-2 ${filters.categoryNames?.split(",").includes(item.name) ? categoryBgColors[item.name] : "bg-white"}`}
                  >
                    <div
                      className={`relative min-w-7 min-h-7 rounded-full ${categoryBgColors[item.name]}  `}
                    >
                      <img
                        src={baseUrl + item.imgPath}
                        className="absolute top-1/2 left-1/2 w-4 h-4 mr-2 -translate-x-1/2 -translate-y-1/2 brightness-[25] z-[0]"
                      />
                    </div>
                    <Typography
                      size={16}
                      weight={400}
                      color={
                        filters.categoryNames?.split(",").includes(item.name)
                          ? COLORS_TEXT.white
                          : ""
                      }
                      className={`text-center line-clamp-1`}
                    >
                      {t(item.name)}
                    </Typography>

                    {filters.categoryNames?.split(",").includes(item.name) && (
                      <div className="w-3">
                        <img src={cancel} alt="Close" className="" />
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Модальное окно для категории */}
      {showCategoryModal && announcementInfo && (
        <div className="fixed bottom-40 left-0 right-0 bg-white p-4 shadow-lg rounded-t-lg z-20">
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
        <div
          key={announcementInfo.id}
          className="fixed bottom-0 left-0 right-0 top-0 flex w-full h-full z-[9999] bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="fixed bottom-0 left-0 right-0 flex w-full bg-white p-4 max-w-full rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#0a7d9e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col w-full min-w-0 pr-8">
                  <Typography
                    size={18}
                    weight={500}
                    className="break-words"
                  >
                    {announcementInfo.title}
                  </Typography>
                  {announcementInfo.duration ? (
                    <Typography className="mb-4 break-words">
                      {`${t("DurationOfService")} - ${announcementInfo.duration}`}
                    </Typography>
                  ) : (
                    <Typography className="mb-2">{t("allDay")}</Typography>
                  )}
                </div>
                <div className="flex flex-row gap-4 w-full min-w-0">
                  <CoveredImage
                    borderRadius="rounded-lg"
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
                          className=" rounded-lg absolute top-3.5 left-3.5 w-4 h-4 -translate-x-1/2 -translate-y-1/2 brightness-[25] z-10"
                          src={`${baseUrl}${announcementInfo.subcategory.category.imgPath || ""}`}
                        />
                      </div>
                    </div>
                  </CoveredImage>
                  <div className="flex-1 min-w-0">
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
                      {role == ROLE_TYPE.TOURIST && (
                        <IconContainer
                          align="center"
                          action={() => addToFavourite()}
                        >
                          <img
                            src={
                              isFavourite ? FavouriteActiveIcon : FavouriteIcon
                            }
                            alt=""
                          />
                        </IconContainer>
                      )}
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
                    {announcementInfo?.schedule && (
                      <Typography
                        size={14}
                        weight={400}
                        color={COLORS_TEXT.gray100}
                      >
                        {isClosed ? t("closed") : t("open")}
                      </Typography>
                    )}
                    <Button
                      onClick={() => {
                        if (
                          announcementInfo?.address?.latitude &&
                          announcementInfo?.address?.longitude
                        ) {
                          calculateRoute(
                            announcementInfo.address.latitude,
                            announcementInfo.address.longitude
                          );
                        }
                      }}
                      mode="transparent"
                      className="max-w-fit"
                    >
                      {`${t("BuildTheRoad")}`}
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  navigate({
                    to: "/announcements/$announcementId",
                    params: {
                      announcementId: announcementInfo.id,
                    },
                    search: {
                      fromMap: true,
                    },
                  });
                }}
                mode="default"
                className="mt-4"
              >
                {`${t("MoreDetails")}`}
              </Button>
            </div>
          </div>
        </div>
      )}
      {isLocationDenied && (
        <div className="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[350px] p-6 rounded-lg shadow-lg text-center">
            <Typography size={16} weight={500} className=" mb-2">
              {t("GeoOn")}
            </Typography>
            <Typography size={14} weight={400} className="text-gray-600 mb-4">
              {t("NeedGeo")}
            </Typography>
            <Button
              onClick={openLocationSettings}
              className="px-4 py-2 text-white shadow-md"
            >
              {t("OpenSettings")}
            </Button>
          </div>
        </div>
      )}

      <NavMenuClient />
    </main>
  );
};

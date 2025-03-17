import React, { useEffect, useState } from "react";
import { apiService } from "../../../services/api/ApiService";
import SideNav from "../../../components/admin/SideNav";
import authBg from "../../../app/icons/bg_auth.png";
import { Loader } from "../../../components/Loader";
import { CoveredImage } from "../../../shared/ui/CoveredImage";
import { baseUrl } from "../../../services/api/ServerData";
import defaultImage from "../../../app/icons/abstract-bg.svg";

import Up from "../../../../public/up.svg";
import Down from "../../../../public/down.svg";

interface AnalyticsData {
  tourists: number;
  orgs: number;
  totalUsers: number;
  adsCount: number;
  ads: {
    image: string;
    title: string;
    price: number;
    bookingCount: number;
    reviewCount: number;
    avgRating: number;
  }[];
  countries: Record<string, number>;
  cities: Record<string, number>;
  languages: Record<string, number>;
  activeUsersNow: number;
  peakUsersToday: number;
}

const BASE_URL = baseUrl;

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleAdsCount, setVisibleAdsCount] = useState(20);
  const [isAscending, setIsAscending] = useState(false);
  const [isCitiesAscending, setIsCitiesAscending] = useState(false);

  useEffect(() => {
    apiService
      .get<AnalyticsData>({ url: "/admin/statistic" })
      .then((response) => {
        if (response.status === 200) {
          setData(response.data);
        } else {
          console.error("Ошибка загрузки данных", response);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  });

  const loadMoreAds = () => {
    setVisibleAdsCount((prevCount) => prevCount + 20);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Ошибка загрузки данных
      </div>
    );
  }

  const handleFilterClick = () => {
    setIsAscending(!isAscending);
  };

  const handleCitiesFilterClick = () => {
    setIsCitiesAscending(!isCitiesAscending);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 🔹 Фон */}
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>

      {/* 🔹 SideNav */}
      <SideNav className="fixed top-0 left-0 z-50" />

      {/* 🔹 Контейнер с аналитикой */}
      <main className="relative flex flex-wrap h-full p-4 overflow-x-auto ml-[94px] transition-all duration-300 custom-admin:flex-nowrap custom-admin:flex-col">
        <div className="flex flex-wrap gap-4 w-full">
          {/* ✅ 1 Колонка */}
          <div className="flex flex-col gap-4 flex-1 min-w-[300px]">
            <Block title="Количество пользователей" className="font-medium">
              <div className="flex space-x-[32px]">
                <div className="flex-grow">
                  <p className="text-4 font-normal">Всего: </p>
                  <p className="text-[22px] font-bold">{data.totalUsers}</p>
                </div>
                <div className="flex-grow">
                  <p className="text-4 font-normal">Туристы: </p>
                  <p className="text-[22px] font-bold">{data.tourists}</p>
                </div>
                <div className="flex-grow">
                  <p className="text-4 font-normal">Организации: </p>
                  <p className="text-[22px] font-bold">{data.orgs}</p>
                </div>
              </div>
            </Block>
            <ScrollableBlock
              title="Статистика по странам"
              className="h-[50vh]"
              isFilterable={true}
              onFilterClick={handleFilterClick}
              isAscending={isAscending}
            >
              {data &&
                data.countries &&
                Object.entries(data.countries)
                  .sort((a, b) => {
                    if (isAscending) {
                      return a[1] - b[1];
                    } else {
                      return b[1] - a[1];
                    }
                  })
                  .map(([country, count]) => (
                    <DataRow key={country} label={country} value={count} />
                  ))}
            </ScrollableBlock>
            <ScrollableBlock title="Статистика по языку" className="h-[27.4vh]">
              {Object.entries(data.languages).map(([language, count]) => (
                <DataRow key={language} label={language} value={count} />
              ))}
            </ScrollableBlock>
          </div>

          {/* ✅ 2 Колонка */}
          <div className="flex flex-col gap-4 flex-1 min-w-[300px]">
            <Block
              title="Количество посетителей сегодня"
              className="font-medium" // Убрали h-[16vh]
            >
              <div className="flex">
                <div className="flex-grow">
                  {" "}
                  {/* Заменили w-[251.5px] на flex-grow */}
                  <p className="text-4 font-normal">Текущее: </p>
                  <p className="text-[22px] font-bold">{data.activeUsersNow}</p>
                </div>
                <div className="flex-grow">
                  {" "}
                  {/* Заменили w-[251.5px] на flex-grow */}
                  <p className="text-4 font-normal">Максимальное: </p>
                  <p className="text-[22px] font-bold">{data.peakUsersToday}</p>
                </div>
              </div>
            </Block>
            <ScrollableBlock
              title="Статистика по городам"
              className="h-[50vh]"
              isFilterable={true}
              onFilterClick={handleCitiesFilterClick}
              isAscending={isCitiesAscending}
            >
              {data &&
                data.cities &&
                Object.entries(data.cities)
                  .sort((a, b) => {
                    const countA = Number(a[1]);
                    const countB = Number(b[1]);
                    if (isCitiesAscending) {
                      return countA - countB;
                    } else {
                      return countB - countA;
                    }
                  })
                  .map(([city, count]) => (
                    <DataRow
                      key={city}
                      label={city === "(not set)" ? "Не установлено" : city}
                      value={Number(count)}
                    />
                  ))}
            </ScrollableBlock>
            <Block
              title="Переход на Google Analytics"
              className="h-[27.4vh] center flex flex-col gap-8"
            >
              <div>
                <div className="flex mb-6">
                  <div className="mr-[48px]">
                    <p className="text-[#999999] text-[12px] mb-2">Пароль</p>
                    <p className="text-4 text-[#000000]">
                      Burabay_travel@gmail.com
                    </p>
                  </div>
                  <div className="">
                    <p className="text-[#999999] text-[12px] mb-2">Логин</p>
                    <p className="text-4 text-[#000000]">Burabay_travel0099</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <a
                    href="https://analytics.google.com/analytics/web/#/p473411842/reports/intelligenthome"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[400px] h-[54px] bg-[#0A7D9E] text-white rounded-[32px] text-[16px] flex items-center justify-center"
                  >
                    Перейти в Google Analytics
                  </a>
                </div>
              </div>
            </Block>
          </div>

          {/* ✅ 3 Колонка */}
          <div className="flex-1 min-w-[300px]">
            <ScrollableBlock
              title={`Всего объявлений: ${data.adsCount}`}
              className="h-full"
            >
              {data.ads.slice(0, visibleAdsCount).map((ad, index) => (
                <div key={index} className="flex py-4 items-center">
                  <span className="mr-2">{index + 1}</span>
                  <CoveredImage
                    width="w-[52px]"
                    height="h-[52px]"
                    borderRadius="rounded-full"
                    imageSrc={`${BASE_URL}${ad.image}`}
                    errorImage={defaultImage}
                  />
                  <div>
                    <p className="text-4">{ad.title}</p>
                    <div className="flex">
                      <p>⭐{ad.avgRating}</p>
                      <p className="text-[#999999] text-4 ml-1">
                        {" "}
                        <b>·</b> {ad.reviewCount} оценок
                      </p>
                    </div>
                  </div>
                  <p className="ml-auto text-4">
                    <p>Брони</p>
                    <p className="text-right">{ad.bookingCount} </p>
                  </p>
                </div>
              ))}
              {visibleAdsCount < data.ads.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={loadMoreAds}
                    className="bg-[#0A7D9E] text-white px-4 py-2 rounded-lg"
                  >
                    Загрузить еще
                  </button>
                </div>
              )}
            </ScrollableBlock>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;

/* Вспомогательные компоненты */
const Block: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  center?: boolean;
}> = ({ title, children, className, center = false }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-md ${className} ${
      center ? "flex flex-col items-center justify-center" : ""
    }`}
  >
    <h2 className="text-[22px] mb-4">{title}</h2>
    {children}
  </div>
);

const ScrollableBlock: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  isFilterable?: boolean;
  onFilterClick?: () => void;
  isAscending?: boolean;
}> = ({
  title,
  children,
  className,
  isFilterable = false,
  onFilterClick,
  isAscending,
}) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-md overflow-auto ${className}`}
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {isFilterable && onFilterClick && (
        <button onClick={onFilterClick}>
          <img
            src={isAscending ? Up : Down}
            alt={
              isAscending
                ? "Сортировка по возрастанию"
                : "Сортировка по убыванию"
            }
            className="w-5 h-5"
          />
        </button>
      )}
    </div>
    {children}
  </div>
);

const DataRow: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <div className="mb-2">
    <p>
      {label}: {value}
    </p>
    <progress
      className="w-full h-[4px] appearance-none overflow-hidden rounded-[9px] bg-gray-300 
                    [&::-webkit-progress-bar]:bg-[#DDDDDD] [&::-webkit-progress-bar]:h-[]
                    [&::-webkit-progress-value]:bg-[#0A7D9E] [&::-webkit-progress-value]:rounded-full 
                    [&::-moz-progress-bar]:bg-[#0A7D9E] [&::-moz-progress-bar]:rounded-full"
      value={value}
      max="100"
    ></progress>
  </div>
);

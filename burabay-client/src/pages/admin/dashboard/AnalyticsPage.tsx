import { useEffect, useState } from "react";
import { apiService } from "../../../services/api/ApiService";
import SideNav from "../../../components/admin/SideNav";
import authBg from "../../../app/icons/bg_auth.png";
import { Loader } from "../../../components/Loader";
import { CoveredImage } from "../../../shared/ui/CoveredImage";
import { baseUrl } from "../../../services/api/ServerData";
import defaultImage from "../../../app/icons/abstract-bg.svg";

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
  }, []);

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
      <main className="relative flex flex-1 h-full p-4 overflow-hidden ml-[94px] transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full">
          {/* ✅ 1 Колонка */}
          <div className="flex flex-col gap-4">
            <Block
              title="Количество пользователей"
              className="font-medium h-[16vh] "
            >
              <div className="flex space-x-[32px]">
                <div className="w-[146.33px]">
                  <p className="text-4 font-normal">Всего: </p>
                  <p className="text-[22px] font-bold">{data.totalUsers}</p>
                </div>
                <div className="w-[146.33px]">
                  <p className="text-4 font-normal">Туристы: </p>
                  <p className="text-[22px] font-bold">{data.tourists}</p>
                </div>
                <div className="w-[146.33px]">
                  <p className="text-4 font-normal">Организации: </p>
                  <p className="text-[22px] font-bold">{data.orgs}</p>
                </div>
              </div>
            </Block>
            <ScrollableBlock title="Статистика по странам" className="h-[50vh]">
              {Object.entries(data.countries).map(([country, count]) => (
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
          <div className="flex flex-col gap-4">
            <Block
              title="Количество посетителей сегодня"
              className="font-medium h-[16vh]"
            >
              <div className="flex">
                <div className="w-[251.5px]">
                  <p className="text-4 font-normal">Текущее: </p>
                  <p className="text-[22px] font-bold">{data.activeUsersNow}</p>
                </div>
                <div className="w-[251.5px]">
                  <p className="text-4 font-normal">Максимальное: </p>
                  <p className="text-[22px] font-bold">{data.peakUsersToday}</p>
                </div>
              </div>
            </Block>
            <ScrollableBlock title="Статистика по городам" className="h-[50vh]">
              {Object.entries(data.cities).map(([city, count]) => (
                <DataRow
                  key={city}
                  label={city === "(not set)" ? "Не установлено" : city}
                  value={Number(count)} // Преобразуем count в число
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
          <div className="h-full overflow-auto">
            <ScrollableBlock
              title={`Всего объявлений: ${data.adsCount}`}
              className="h-full"
            >
              {data.ads.slice(0, visibleAdsCount).map((ad, index) => (
                <div key={index} className="flex py-4 items-center">
                  <span className="mr-2">{index + 1}</span>{" "}
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
}> = ({ title, children, className }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-md overflow-auto ${className}`}
  >
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
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

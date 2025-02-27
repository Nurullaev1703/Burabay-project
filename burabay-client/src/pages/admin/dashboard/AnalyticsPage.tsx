import { useEffect, useState } from "react";
import { apiService } from "../../../services/api/ApiService";
import SideNav from "../../../components/admin/SideNav";
import authBg from "../../../app/icons/bg_auth.png";
import { Loader }  from "../../../components/Loader";

interface AnalyticsData {
  tourists: number;
  orgs: number;
  totalUsers: number;
  ads: { title: string; price: number }[];
  countries: Record<string, number>;
  cities: Record<string, number>;
  languages: Record<string, number>;
  activeUsersNow: number;
  peakUsersToday: number;
}

const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg"><Loader /></div>;
  }

  if (!data) {
    return <div className="flex items-center justify-center h-screen text-lg">Ошибка загрузки данных</div>;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 🔹 Фон */}
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${authBg})` }}></div>

      {/* 🔹 SideNav */}
      <SideNav className="fixed top-0 left-0 z-50" />

      {/* 🔹 Контейнер с аналитикой */}
      <main className="relative flex flex-1 h-full p-4 overflow-hidden ml-[94px] transition-all duration-300">
        <div className="grid grid-cols-3 gap-4 w-full h-full">
          {/* ✅ 1 Колонка */}
          <div className="flex flex-col gap-4">
            <Block title="Количество пользователей" className="h-[16vh]">
              <p>Всего: {data.totalUsers}</p>
              <p>Туристы: {data.tourists}</p>
              <p>Организации: {data.orgs}</p>
            </Block>
            <ScrollableBlock title="Статистика по странам" className="h-[40vh]">
              {Object.entries(data.countries).map(([country, count]) => (
                <DataRow key={country} label={country} value={count} />
              ))}
            </ScrollableBlock>
            <ScrollableBlock title="Статистика по языку" className="h-[20vh]">
              {Object.entries(data.languages).map(([language, count]) => (
                <DataRow key={language} label={language} value={count} />
              ))}
            </ScrollableBlock>
          </div>

          {/* ✅ 2 Колонка */}
          <div className="flex flex-col gap-4">
            <Block title="Количество посетителей сегодня" className="h-[16vh]">
              <p>Текущее: {data.activeUsersNow}</p>
              <p>Максимальное: {data.peakUsersToday}</p>
            </Block>
            <ScrollableBlock title="Статистика по городам" className="h-[40vh]">
              {Object.entries(data.cities).map(([city, count]) => (
                <DataRow key={city} label={city} value={count} />
              ))}
            </ScrollableBlock>
            <Block title="Переход на Google Analytics" className="h-[20vh] center">
              <button className="w-[400px] h-[54px] bg-blue-600 text-white rounded-[32px] text-lg hover:bg-blue-700 transition">
                Перейти в Google Analytics
              </button>
            </Block>
          </div>

          {/* ✅ 3 Колонка */}
          <div className="w-[660px] h-full overflow-auto">
            <ScrollableBlock title="Всего объявлений" className="h-full">
              {data.ads.length > 0 ? (
                data.ads.map((ad, index) => (
                  <div key={index} className="border-b py-4">
                    <p>{ad.title}</p>
                    <p>Цена: {ad.price}</p>
                  </div>
                ))
              ) : (
                <p>Объявлений нет</p>
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
const Block: React.FC<{ title: string; children: React.ReactNode; className?: string; center?: boolean }> = ({ title, children, className, center = false }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md ${className} ${center ? "flex flex-col items-center justify-center" : ""}`}>
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const ScrollableBlock: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md overflow-auto ${className}`}>
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const DataRow: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="mb-2">
    <p>{label}: {value}</p>
    <progress className="progress-bar w-full h-[2px] bg-gray-300" value={value} max="100"></progress>
  </div>
);

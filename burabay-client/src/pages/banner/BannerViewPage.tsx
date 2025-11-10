import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import Close from "/Close.png?url";
import { baseUrl } from "../../services/api/ServerData";
import { apiService } from "../../services/api/ApiService";

interface Banner {
  id: string;
  title: string;
  text: string;
  imagePath: string;
  deleteDate: string;
}

const BannerViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { bannerId } = useParams({ from: "/banner/$bannerId" });
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await apiService.get<Banner>({
          url: `/main-pages/banners/${bannerId}`,
        });
        setBanner(response.data);
      } catch (error) {
        console.error("Error fetching banner:", error);
        navigate({ to: "/main" });
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [bannerId]);

  const handleClose = () => {
    navigate({ to: "/main" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  if (!banner) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header с заголовком и кнопкой закрытия */}
      <div className="sticky top-0 bg-white z-20 flex items-center justify-between px-3 py-2 border-b shadow-sm">
        <div className="w-[44px] h-[44px]" />
        <div className="flex-grow text-center">
          <p className="text-[#0A7D9E] text-[18px] font-semibold">Баннер</p>
        </div>
        <button
          aria-label="Закрыть баннер"
          className="w-[44px] h-[44px] flex items-center justify-center"
          onClick={handleClose}
        >
          <img src={Close} alt="Закрыть" className="w-11 h-11" />
        </button>
      </div>

      {/* Контейнер для изображения и текста */}
      <div className="w-full max-w-full p-4">
        <img
          src={`${baseUrl}${banner.imagePath}`}
          alt={banner.text}
          className="w-full max-w-full max-h-[60vh] object-contain mb-4 rounded-lg"
        />
        <h3 className="text-[20px] font-semibold text-black mb-2 break-words box-border w-full max-w-full">
          {banner.title}
        </h3>
        <p className="text-[18px] break-words box-border w-full max-w-full whitespace-pre-wrap">
          {banner.text}
        </p>
      </div>
    </div>
  );
};

export default BannerViewPage;

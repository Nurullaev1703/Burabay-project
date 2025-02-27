import React, { useEffect, useState } from "react";
import SideNav from "../../../components/admin/SideNav";
import { apiService } from "../../../services/api/ApiService";
import { RatingStars } from "../../../shared/ui/RatingStars";
import authBg from "../../../app/icons/bg_auth.png";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

interface Review {
  reviewId: string;
  username: string;
  reviewDate: string;
  reviewStars: number;
  reviewText: string;
  reviewImages?: string[];
  adImage: string;
  adName: string;
  adReviewCount: number;
  adRating: number;
  orgName: string;
  orgImage: string;
  reportText: string;
  reportData: string;
}

const ComplaintsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hint, setHint] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiService.get<Review[]>({ url: "/admin/reports" });

        if (response.status === 200) {
          setReviews(response.data);
        } else {
          console.error("Ошибка загрузки данных:", response);
        }
      } catch (error) {
        console.error("Ошибка запроса:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await apiService.delete({ url: `/review/${reviewId}` });
      if (response.status === 200) {
        setReviews(reviews.filter((review) => review.reviewId !== reviewId));
        setHint({ message: "Отзыв успешно удален", type: "success" });
      } else {
        setHint({ message: "Ошибка при удалении отзыва", type: "error" });
      }
    } catch (error) {
      setHint({ message: "Ошибка при удалении отзыва", type: "error" });
      console.error("Ошибка удаления отзыва:", error);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex">
      {/* Фон */}
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35 z-[-1]"></div>
      <div className="absolute inset-0 bg-cover bg-center opacity-25 z-[-1]" style={{ backgroundImage: `url(${authBg})` }}></div>
      
      {/* Боковая навигация */}
      <div onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
        <SideNav className={`fixed top-0 left-0 h-full transition-all duration-300 ease-linear ${isExpanded ? "w-[312px]" : "w-[94px]"}`} />
      </div>
      
      {/* Основной контент */}
      <div className={`flex-1 flex flex-col items-center px-2 transition-all duration-300 ease-linear ${isExpanded ? "ml-[312px]" : "ml-[94px]"}`}>
        {hint && (
          <div className={`fixed top-5 right-5 px-4 py-2 rounded-lg text-white ${hint.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {hint.message}
          </div>
        )}

        <div className="grid grid-cols-[2fr_2fr_1fr] w-full px-2 bg-white shadow-md pl-[32px] pr-[32px] pb-[32px] pt-[24px] font-semibold rounded-b-[16px]">
          <div className="text-left border-r border-gray-300 ">Отзыв</div>
          <div className="text-left border-r border-gray-300">Жалоба</div>
          <div className="text-left">Действие</div>
        </div>

        <div className="w-full flex flex-col py-[10px] gap-4">
          {isLoading ? (
            <p className="text-center text-gray-500 mt-4">Загрузка данных...</p>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.reviewId} className="grid grid-cols-[2fr_2fr_1fr] border border-gray-300 max-h-[330px] bg-white rounded-lg shadow-md pl-[32px] pr-[32px] pb-[32px] pt-[24px] ">
                <div className="border-r border-gray-300 pr-4 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{review.username}</p>
                      <p className="text-gray-500 text-sm">{formatDate(review.reviewDate)}</p>
                      <RatingStars rating={review.reviewStars} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">{review.adName}</p>
                      <div className="text-[16px] text-yellow-500 flex items-center">
                        ⭐ {review.adRating} ({review.adReviewCount})
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{review.reviewText}</p>
                  {review.reviewImages && (
                    <div className="flex gap-2 mt-2">
                      {review.reviewImages.map((img, idx) => (
                        <img key={idx} src={`${BASE_URL}${img}`} alt="Фото отзыва" className="w-[80px] h-[80px] rounded-md object-cover" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-r border-gray-300 p-4 flex flex-col">
                  <div className="flex items-center gap-3">
                    <img src={review.orgImage ? `${BASE_URL}${review.orgImage}` : "/default-org.png"} alt={review.orgName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{review.orgName}</p>
                      <p className="text-gray-500 text-sm">{formatDate(review.reportData)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{review.reportText}</p>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <button className="bg-[#39B56B] max-w-[400px] w-[268px] h-[54px] rounded-[32px] text-white px-4 py-2 text-sm md:text-base hover:opacity-80 cursor-pointer">
                    Оставить отзыв
                  </button>
                  <button onClick={() => handleDeleteReview(review.reviewId)} className="bg-[#FF5959] max-w-[400px] w-[268px] h-[54px] rounded-[32px] text-white px-4 py-2 text-sm md:text-base hover:opacity-80 cursor-pointer">
                    Удалить отзыв
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">Нет жалоб на отзывы.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;
import { FC, useEffect, useState } from "react";
import SideNav from "../../../components/admin/SideNav";
import { apiService } from "../../../services/api/ApiService";
import { RatingStars } from "../../../shared/ui/RatingStars";
import { AdCard } from "../../main/ui/AdCard";
import authBg from "../../../app/icons/bg_auth.png";
import { Announcement } from "../../announcements/model/announcements";
import { baseUrl } from "../../../services/api/ServerData";
import { CoveredImage } from "../../../shared/ui/CoveredImage";
import defaultImage from "../../../app/icons/abstract-bg.svg";

const BASE_URL = baseUrl;

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
  orgName: string | null;
  orgImage: string | null;
  reportText: string;
  reportData: string;
  id: string;
  organization: Organization;
  orgId: string;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  website?: string;
  phone?: string;
  user: { email: string };
  ads: Announcement[];
}

export const ComplaintsPage: FC = function ComplaintPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hint, setHint] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiService.get<Review[]>({
          url: "/admin/reports",
        });

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

  const fetchOrgInfo = async (orgId: string) => {
    try {
      const response = await apiService.get<Organization>({
        url: `/admin/org-info/${orgId}`,
      });

      if (response.status === 200) {
        console.log("Информация об организации:", response.data);
        setSelectedOrg(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных организации:", error);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex">
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35 z-[-1]"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 z-[-1]"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <SideNav
          className={`fixed top-0 left-0 h-full transition-all duration-300 ease-linear ${
            isExpanded ? "w-[312px]" : "w-[94px]"
          }`}
        />
      </div>
      <div
        className={`flex-1 flex flex-col items-center px-2 transition-all duration-300 ease-linear ${
          isExpanded ? "ml-[312px]" : "ml-[94px]"
        }`}
      >
        {hint && (
          <div
            className={`fixed top-5 right-5 px-4 py-2 rounded-lg text-white ${
              hint.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {hint.message}
          </div>
        )}
        <div className="h-[68px] grid grid-cols-[1fr_1fr_332px] w-full bg-white font-roboto rounded-b-[16px]">
          <div className="border-r pl-[32px] h-full flex items-center">
            <div className="text-left text-[24px] font-normal flex items-center ">
              Отзыв
            </div>
          </div>
          <div className="border-r pl-[32px] h-full flex items-center border-gray-300">
            <div className="text-left text-[24px] font-normal flex items-center self-stretch ">
              Жалобы
            </div>
          </div>
          <div className=" h-full pl-[32px] flex items-center">
            <div className="text-left text-[24px] font-normal flex items-center self-stretch ">
              Действие
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col py-[10px] gap-4">
          {isLoading ? (
            <p className="text-center text-gray-500 mt-4">Загрузка данных...</p>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.reviewId}
                className="grid grid-cols-[1fr_1fr_332px] max-h-[330px] bg-white rounded-lg"
              >
                <div className="h-full p-[32px] pr-[32px] flex flex-col border-r">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {review.username}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {formatDate(review.reviewDate)}
                      </p>
                      <RatingStars rating={review.reviewStars} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">
                        {review.adName}
                      </p>
                      <div className="text-[16px] text-yellow-500 flex items-center">
                        ⭐ {review.adRating} ({review.adReviewCount})
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{review.reviewText}</p>
                  {review.reviewImages && (
                    <div className="flex gap-2 mt-2">
                      {review.reviewImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={`${BASE_URL}${img}`}
                          alt="Фото отзыва"
                          className="w-[80px] h-[80px] rounded-md object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-r border-gray-300 p-[32px] flex flex-col">
                  <div className="flex items-center gap-3">
                    <CoveredImage
                      width="w-10"
                      height="h-10"
                      borderRadius="rounded-full"
                      imageSrc={`${BASE_URL}${review.orgImage}`}
                      errorImage={defaultImage}
                    />
                    <div>
                      {review.orgName ? (
                        <p
                          className="font-semibold cursor-pointer text-blue-500"
                          onClick={() => fetchOrgInfo(review.orgId)}
                        >
                          {review.orgName}
                        </p>
                      ) : (
                        <p>Нет данных</p>
                      )}
                      <p className="text-gray-500 text-sm">
                        {formatDate(review.reportData)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {review.reportText}
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-3 w-full p-[32px]">
                  <button className="bg-[#39B56B] max-w-[400px] w-[268px] h-[54px] rounded-[32px] text-white py-2 text-sm md:text-base hover:opacity-80 cursor-pointer">
                    Оставить отзыв
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.reviewId)}
                    className="bg-[#FF5959] max-w-[400px] w-[268px] h-[54px] rounded-[32px] text-white px-4 py-2 text-sm md:text-base hover:opacity-80 cursor-pointer"
                  >
                    Удалить отзыв
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">
                            Нет жалоб на отзывы.        
            </p>
          )}
        </div>
      </div>
      {isModalOpen && selectedOrg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[900px] w-[772px] overflow-y-auto relative">
            <div className="flex items-center justify-between w-full absolute top-0 left-0 right-0 p-4 gap-4">
              <button
                className="h-[44px] w-[44px]"
                onClick={() => setIsModalOpen(false)}
              >
                <img
                  src="../../../app/icons/admin/Close.png"
                  alt="Назад"
                  className="w-full h-full"
                />
              </button>
              <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] leading-[20px] tracking-[0.4px] text-center flex-grow">
                                Организация          
              </h2>
              <button
                className="h-[44px] w-[44px]"
                onClick={() => setIsModalOpen(false)}
              >
                <img
                  src="../../../app/icons/admin/Close.png"
                  alt="Выход"
                  className="w-full h-full"
                />
              </button>
            </div>
            <div className="flex justify-center mt-[68px]">
              <CoveredImage
                width="w-[128px]"
                height="h-[128px]"
                borderRadius="rounded-full"
                imageSrc={`${BASE_URL}${selectedOrg.imgUrl}`}
                errorImage={defaultImage}
              />
            </div>
                        {/* Название организации */}       
            <h2 className="font-roboto font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4">
                            {selectedOrg.name}       
            </h2>
                        {/* Описание организации */}       
            <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] text-left text-black mt-2">
                            {selectedOrg.description || "Описание отсутствует"} 
            </p>
                        {/* Контейнер для сайта, телефона, email с бордерами */}
            <div className="mt-4">
              <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
                <div className="flex flex-col items-start">
                  <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] text-black">
                                        {selectedOrg.website || "Не указано"}   
                  </p>
                  <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                                        Сайт              
                  </strong>
                </div>
              </div>
              <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
                <div className="flex flex-col items-start">
                  <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px]">
                    {selectedOrg.phone || "Не указан"}     
                  </p>
                  <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                                        Телефон
                  </strong>
                </div>
              </div>
              <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
                <div className="flex flex-col items-start">
                  <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px]">
                                        {selectedOrg.user?.email || "Не указан"}
                  </p>
                               
                  <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                                        Email              
                  </strong>
                </div>
              </div>
            </div>
                        {/* Отображение объявлений */}       
            {selectedOrg.ads.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                           
                {selectedOrg.ads.map((ad, index) => (
                  <AdCard key={index} ad={ad} isOrganization={true} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Нет объявлений</p>
            )}
                        {/* Кнопки блокировки/разблокировки */}       
            <div className="mt-4 flex justify-between mb-8">
                       
              <button className="bg-red text-white px-4 py-2 rounded-lg">
                                Заблокировать пользователя          
              </button>
                       
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                                Разблокировать          
              </button>
                     
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;

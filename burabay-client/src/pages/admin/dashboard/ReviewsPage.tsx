import { FC, useState, useRef } from "react";
import { apiService } from "../../../services/api/ApiService";
import { RatingStars } from "../../../shared/ui/RatingStars";
import authBg from "../../../app/icons/bg_auth.png";
import { baseUrl } from "../../../services/api/ServerData";
import defaultImage from "../../../app/icons/abstract-bg.svg";
import { Loader } from "../../../components/Loader";
import noComp from "../../../app/icons/noComp.svg?url";
import { useNavigate } from "@tanstack/react-router";
import SideNav from "../../../components/admin/SideNav";
import { CoveredImage } from "../../../shared/ui/CoveredImage";
import { useQueryClient } from "@tanstack/react-query";

import Back from "../../../../public/Back.svg";
import Close from "../../../../public/Close.png";
import { useGetReviews } from "./model/review-filter";

const BASE_URL = baseUrl;

interface Review {
  id: string;
  images: string[];
  text: string;
  stars: number;
  isCheked: boolean;
  date: string;
  picture: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  ad: {
    id: string;
    title: string;
    description: string;
    images: string[];
    subcategory: {
      name: string;
      category: {
        name: string;
      };
    };
  };
  user: {
    id: string;
    fullName: string;
    picture: string;
    phoneNumber: string;
    email: string;
  };
}

const ReviewsPage: FC = () => {
  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const [visibleReviewsCount, _setVisibleReviewsCount] = useState(20);
  const [_isExpanded, setIsExpanded] = useState(false);
  const [_reviews, _setReviews] = useState<Review[]>([]);
  const [_isModalOpen, setIsModalOpen] = useState(false);
  const [isTouristModalOpen, setIsTouristModalOpen] = useState<Review | null>(
    null
  );
  const [selectedTourist, setSelectedTourist] = useState<Review | null>(null);
  const [reviewHints, setReviewHints] = useState<Record<string, { message: string; type: string; status?: string }> >({});
  const navigate = useNavigate();
  const take = 8;
  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetReviews({ take });

  const reviews = (data?.pages.flat() || []).slice().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    setReviewHints((prev) => ({
      ...prev,
      [reviewId]: {
        message: "Отзыв будет удален через 10 секунд",
        type: "success",
        status: "deleted",
      },
    }));

    if (timers.current[reviewId]) {
      clearTimeout(timers.current[reviewId]);
    }

    timers.current[reviewId] = setTimeout(async () => {
      try {
        const response = await apiService.delete({
          url: `/review/${reviewId}`,
        });
        if (response.status === 200) {
          queryClient.setQueryData(["admin-reviews", { take }], (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page: any[]) =>
                page.filter((review) => review.id !== reviewId)
              ),
            };
          });
          setReviewHints((prev) => {
            const copy = { ...prev };
            delete copy[reviewId];
            return copy;
          });
        }
      } catch (error) {
        setReviewHints((prev) => ({
          ...prev,
          [reviewId]: {
            message: "Ошибка при удалении отзыва",
            type: "error",
          },
        }));
      } finally {
        delete timers.current[reviewId];
      }
    }, 10000);
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-org/${userId}`,
        dto: { value: false },
      });
      if (response.status === 200) {
        setIsModalOpen(false);
      } else {
      }
    } catch (error) {
      console.error("Ошибка разблокировки пользователя:", error);
    }
  };

  const handleBlockTourist = async (userId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-tourist/${userId}`,
        dto: { value: true },
      });
      if (response.status === 200) {
        setIsTouristModalOpen(null);
      } else {
      }
    } catch (error) {
      console.error("Ошибка блокировки туриста:", error);
    }
  };
  const fetchTouristInfo = async (userId: string) => {
    try {
      const response = await apiService.get<Review>({
        url: `/admin/tourist-info/${userId}`,
      });

      if (response.status === 200) {
        console.log("Информация о туристе:", response.data);

        setSelectedTourist(response.data);
        setIsTouristModalOpen(response.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных туриста:", error);
    }
  };

  const handleCancelHint = (reviewId: string) => {
    setReviewHints((prev) => {
      const copy = { ...prev };
      delete copy[reviewId];
      return copy;
    });
    if (timers.current[reviewId]) {
      clearTimeout(timers.current[reviewId]);
      delete timers.current[reviewId];
    }
  };

  const loadMoreReviews = () => {
    fetchNextPage();
  };

  return (
    <div className="relative w-full min-h-screen flex">
      <div className="fixed inset-0 bg-[#0A7D9E] opacity-35 z-[-1]"></div>
      <div
        className="fixed inset-0 bg-cover bg-center opacity-25 z-[-1]"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>
      <div
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <SideNav />
      </div>
      <div className="flex-1 flex flex-col items-center px-2 transition-all duration-300 ease-linear ml-[94px]">
        <div className="max-w-[1200px] w-full mx-auto">
          {reviews.length > 0 && (
            <div className="h-[68px] grid grid-cols-[1fr_332px] w-full border-[2px] border-[#E4E9EA] bg-white font-roboto rounded-b-[16px]">
              <div className="pl-[32px] h-full flex items-center">
                <div className="text-left text-[24px] font-normal flex items-center ">
                  Отзывы
                </div>
              </div>
            </div>
          )}
          <div
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 py-[10px]"
          >
            {isLoading ? (
              <Loader />
            ) : reviews.length > 0 ? (
              <>
                {reviews.slice(0, visibleReviewsCount).map((review) => (
                  <div
                    key={review.id}
                    className={`rounded-[16px] bg-white shadow-md flex flex-col justify-between
                      min-w-[300px] max-w-[600px] w-full mx-auto
                      ${reviewHints[review.id]?.status
                        ? reviewHints[review.id].status === "deleted"
                          ? "bg-[#FF5959]"
                          : "bg-[#59C183]"
                        : "bg-white"
                      }`}
                    style={{ width: "100%", minHeight: "400px", maxWidth: "600px" }}
                  >
                    {reviewHints[review.id]?.status ? (
                      <div className={`col-span-2 flex items-center justify-between rounded-[16px] px-4 py-2 ${
                        reviewHints[review.id].status === "deleted"
                          ? "bg-[#FF5959]"
                          : "bg-[#59C183]"
                      }`}>
                        <div className="p-2 text-white rounded">
                          {reviewHints[review.id].status === "deleted"
                            ? "Комментарий удален"
                            : "Комментарий оставлен"}
                        </div>
                        <button
                          onClick={() => handleCancelHint(review.id)}
                          className={`p-2 text-white rounded bg-inherit ${
                            reviewHints[review.id].status === "deleted"
                              ? "bg-[#FF5959]"
                              : "bg-[#59C183]"
                          }`}
                        >
                          Отменить
                        </button>
                      </div>
                    ) : (
                      <>
                        <div
                          key={review.id}
                          className="h-full p-[32px] pr-[32px] flex flex-col border-r"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p
                                className={`text-sm font-semibold text-gray-700 ${
                                  !isLoading
                                    ? "cursor-pointer text-blue-500"
                                    : "text-gray-500 cursor-default"
                                }`}
                                onClick={() => {
                                  if (!isLoading && review && review.user.id) {
                                    fetchTouristInfo(review.user.id);
                                    fetchTouristInfo(review.user.id);
                                  } else if (isLoading) {
                                    console.warn("Данные еще загружаются.");
                                  } else {
                                    console.log("review:", review);
                                    console.warn(
                                      "Не удалось получить ID пользователя для данного отзыва."
                                    );
                                  }
                                }}
                              >
                                {review.user.fullName || "Не указано"}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {formatDate(review.date)}
                              </p>
                              <RatingStars rating={review.stars} />
                            </div>
                            <div
                              key={review.ad.id}
                              className="flex items-center"
                              onClick={() =>
                                navigate({
                                  to: `/admin/announcements/${review.ad.id}`,
                                })
                              }
                            >
                              <img
                                src={`${BASE_URL}${review.ad.images[0]}`}
                                alt="Фото курорта"
                                className="w-[52px] h-[52px] rounded-md object-cover"
                                onError={(e) =>
                                  (e.currentTarget.src = defaultImage)
                                }
                              />
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-700">
                                  {review.ad.title || "Без названия"}
                                </p>
                                <div className="text-[16px] text-black flex items-center">
                                  ⭐ {review.stars}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-[#000000] mt-2 break-words whitespace-pre-wrap overflow-wrap break-word word-break break-all">
                            {review.text}
                          </p>
                          {review.images && (
                              <div className="flex gap-2 mt-2">
                              {review.images.map((img: string, idx: number) => (
                                <img
                                key={idx}
                                src={`${BASE_URL}${img}`}
                                alt="Фото орагнизации"
                                className="w-[80px] h-[80px] rounded-md object-cover"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                                  (e.currentTarget.src = defaultImage)
                                }
                                />
                              ))}
                              </div>
                          )}
                        </div>
                        {!review.status && (
                          <div className="flex flex-col items-center space-y-3 w-full p-[32px]">
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="bg-[#FF5959] max-w-[400px] w-[268px] h-[54px] rounded-[32px] text-white px-4 py-2 text-sm md:text-base hover:opacity-80 cursor-pointer"
                            >
                              Удалить отзыв
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full absolute inset-0 pointer-events-none">
                <div className="flex flex-col items-center bg-white/75 blur-10 justify-center h-[278px] w-[358px] rounded-lg pointer-events-auto">
                  <img
                    src={noComp}
                    alt="Нет отзывов"
                    className="w-[150px] h-[150px] mb-4"
                  />
                  <p className="text-center text-black text-lg">
                    Отзывов пока нет
                  </p>
                </div>
              </div>
            )}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8 mb-8 w-full">
              <button
                onClick={loadMoreReviews}
                className="bg-[#0A7D9E] text-white w-[400px] h-[54px] rounded-[32px] px-4 py-2"
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Загрузка..." : "Загрузить ещё"}
              </button>
            </div>
          )}

          {isTouristModalOpen && selectedTourist && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-h-[900px] w-[772px] overflow-y-auto relative">
                <div className="flex items-center justify-between w-full absolute top-0 left-0 right-0 p-4 gap-4">
                  <button
                    className="h-[44px] w-[44px]"
                    onClick={() => setIsTouristModalOpen(null)}
                  >
                    <img src={Back} alt="Назад" className="w-6 h-6" />
                  </button>
                  <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] leading-[20px] tracking-[0.4px] text-center flex-grow">
                    Турист
                  </h2>
                  <button
                    className="h-[44px] w-[44px]"
                    onClick={() => setIsTouristModalOpen(null)}
                  >
                    <img src={Close} alt="Выход" className="w-full h-full" />
                  </button>
                </div>
                <div className="flex justify-center mt-[68px]">
                  <CoveredImage
                    width="w-[128px]"
                    height="h-[128px]"
                    borderRadius="rounded-full"
                    imageSrc={
                      selectedTourist.picture
                        ? `${BASE_URL}${selectedTourist.picture}`
                        : defaultImage
                    }
                    errorImage={defaultImage}
                  />
                </div>
                <h2 className="font-roboto font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4">
                  {selectedTourist.fullName}
                </h2>
                <div className="mt-4">
                  <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
                    <div className="flex flex-col items-start">
                      <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px]">
                        {selectedTourist.phoneNumber || "Не указан"}
                      </p>
                      <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                        Телефон
                      </strong>
                    </div>
                  </div>
                  <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
                    <div className="flex flex-col items-start">
                      <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px]">
                        {selectedTourist.email || "Не указан"}
                      </p>
                      <strong className="font-roboto font-normal text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                        Email
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4 mt-4">
                  <div>
                    <button
                      className="bg-white text-[#FF4545] border-[3px] font-medium border-[#FF4545] px-4 py-2 w-[400px] h-[54px] rounded-[32px] z-10"
                      onClick={() => handleBlockTourist(selectedTourist.id)}
                    >
                      Заблокировать пользователя
                    </button>
                    <div>
                      <button
                        className="bg-[#39B56B] mt-4 text-white px-4 py-2 font-medium w-[400px] h-[54px] rounded-[32px] z-10"
                        onClick={() => {
                          handleUnblockUser(selectedTourist.id);
                        }}
                      >
                        Разблокировать пользователя
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;

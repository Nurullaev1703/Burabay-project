import { FC, useState } from "react";
import { RatingStars } from "../../../shared/ui/RatingStars";
import { apiService } from "../../../services/api/ApiService";
import authBg from "../../../app/icons/bg_auth.png";
import { baseUrl } from "../../../services/api/ServerData";
import defaultImage from "../../../app/icons/abstract-bg.svg";
import { Loader } from "../../../components/Loader";
import noComp from "../../../app/icons/noComp.svg?url";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SideNav from "../../../components/admin/SideNav";
import { CoveredImage } from "../../../shared/ui/CoveredImage";
import { AdminAnnouncementModal } from "../announcements/AdminAnnouncementModal";
import { UseGetAnnouncement } from "../../announcements/announcement/announcement-util";

import Back from "/Back.svg?url";
import Close from "/Close.png?url";
import { useGetReviews } from "./model/useGetReviews";

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
    description: string[];
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
  const [visibleReviewsCount, _setVisibleReviewsCount] = useState(20);
  const [_isExpanded, setIsExpanded] = useState(false);
  const [_isModalOpen, setIsModalOpen] = useState(false);
  const [isTouristModalOpen, setIsTouristModalOpen] = useState<Review | null>(
    null
  );
  const [selectedTourist, setSelectedTourist] = useState<Review | null>(null);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<
    string | null
  >(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();
  const take = 9;

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    handleDeleteReview,
    handleCancelHint,
    reviewHints,
  } = useGetReviews({ take });

  const reviews = data?.pages.flat() || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
    } catch (error) {}
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
    } catch (error) {}
  };
  const fetchTouristInfo = async (userId: string) => {
    try {
      const response = await apiService.get<Review>({
        url: `/admin/tourist-info/${userId}`,
      });

      if (response.status === 200) {
        setSelectedTourist(response.data);
        setIsTouristModalOpen(response.data);
      }
    } catch (error) {}
  };
  const { t } = useTranslation();

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
      <div className="flex-1 flex flex-col items-center transition-all duration-300 ease-linear ml-[94px] h-screen">
        <div className="w-full mx-auto h-full flex flex-col px-4">
          {reviews.length > 0 && (
            <div className="h-[68px] grid grid-cols-[1fr_332px] w-full border-[2px] border-[#E4E9EA] bg-white font-roboto rounded-b-[16px] flex-shrink-0">
              <div className="pl-[32px] h-full flex items-center">
                <div className="text-left text-[24px] font-normal flex items-center">
                  Отзывы
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto admin-scrollbar px-2">
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-6 py-[10px]">
              {isLoading ? (
                <Loader />
              ) : reviews.length > 0 ? (
                <>
                  {reviews.slice(0, visibleReviewsCount).map((review) => (
                    <div
                      key={review.id}
                      className={`rounded-[16px] shadow-md flex flex-col justify-between min-w-[300px] max-w-[400px] w-full mx-auto transition-all duration-300 ease-in-out transform
                      ${
                        reviewHints[review.id]?.status
                          ? reviewHints[review.id].status === "pending"
                            ? "bg-gradient-to-br from-red-400 to-red-600 scale-95 opacity-90"
                            : reviewHints[review.id].status === "deleted"
                              ? "bg-gradient-to-br from-red-500 to-red-700 scale-90 opacity-75"
                              : "bg-gradient-to-br from-green-400 to-green-600 scale-100 opacity-100"
                          : "bg-white scale-100 opacity-100"
                      }`}
                      style={{
                        width: "100%",
                        maxWidth: "600px",
                      }}
                    >
                      {reviewHints[review.id]?.status ? (
                        <div
                          className={`flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px] rounded-[16px]
                          ${
                            reviewHints[review.id].status === "pending"
                              ? "bg-red-600 border-2 border-red-700"
                              : reviewHints[review.id].status === "deleted"
                                ? "bg-red-700 border-2 border-red-800"
                                : "bg-gradient-to-br from-green-400 to-green-600"
                          }`}
                        >
                          {reviewHints[review.id].status === "pending" ? (
                            <div className="flex flex-col items-center space-y-4">
                              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                              <div className="text-white font-bold text-lg">
                                УДАЛЕНИЕ ОТЗЫВА
                              </div>
                              <div className="text-white text-sm font-medium">
                                Операция выполняется...
                              </div>
                            </div>
                          ) : reviewHints[review.id].status === "deleted" ? (
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <svg
                                  className="w-6 h-6 text-red-700"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </div>
                              <div className="text-white font-bold text-lg">
                                ОТЗЫВ УДАЛЕН
                              </div>
                              <div className="text-white text-sm font-medium">
                                Операция выполнена
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <div className="text-white font-medium text-lg">
                                Операция выполнена
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => handleCancelHint(review.id)}
                            className={`mt-6 px-6 py-2 font-bold rounded-lg transition-all duration-200 border-2 shadow-lg
                              ${
                                reviewHints[review.id].status === "pending" ||
                                reviewHints[review.id].status === "deleted"
                                  ? "bg-white text-red-700 border-white hover:bg-red-50 hover:text-red-800"
                                  : "bg-white text-green-700 border-white hover:bg-green-50 hover:text-green-800"
                              }`}
                          >
                            Отменить
                          </button>
                        </div>
                      ) : (
                        <>
                          <div
                            key={review.id}
                            className="h-full p-5 flex flex-col"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-shrink min-w-0">
                                <p
                                  className={`text-sm font-semibold text-gray-700 truncate max-w-[150px] ${
                                    !isLoading
                                      ? "cursor-pointer text-blue-500"
                                      : "text-gray-500 cursor-default"
                                  }`}
                                  onClick={() => {
                                    if (
                                      !isLoading &&
                                      review &&
                                      review.user.id
                                    ) {
                                      fetchTouristInfo(review.user.id);
                                    } else if (isLoading) {
                                    } else {
                                    }
                                  }}
                                  title={review.user.fullName || "Не указано"}
                                >
                                  {review.user.fullName || "Не указано"}
                                </p>
                                <p className="text-gray-500 text-sm ">
                                  {formatDate(review.date)}
                                </p>
                                <RatingStars rating={review.stars} />
                              </div>
                              <div
                                key={review.ad.id}
                                className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
                                onClick={() => {
                                  setSelectedAnnouncementId(review.ad.id);
                                  setIsAnnouncementModalOpen(true);
                                }}
                              >
                                <img
                                  src={`${BASE_URL}${review.ad.images[0]}`}
                                  alt="Фото курорта"
                                  className="w-[52px] h-[52px] rounded-md object-cover flex-shrink-0"
                                  onError={(e) =>
                                    (e.currentTarget.src = defaultImage)
                                  }
                                />
                                <div className="text-right min-w-0">
                                  <p
                                    className="text-sm font-semibold text-gray-700 truncate max-w-[100px]"
                                    title={review.ad.title || "Без названия"}
                                  >
                                    {review.ad.title || "Без названия"}
                                  </p>
                                  <div className="text-[16px] text-black flex items-center justify-end">
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
                                {review.images.map(
                                  (img: string, idx: number) => (
                                    <img
                                      key={idx}
                                      src={`${BASE_URL}${img}`}
                                      alt="Фото орагнизации"
                                      className="w-[80px] h-[80px] rounded-md object-cover"
                                      onError={(
                                        e: React.SyntheticEvent<
                                          HTMLImageElement,
                                          Event
                                        >
                                      ) => (e.currentTarget.src = defaultImage)}
                                    />
                                  )
                                )}
                              </div>
                            )}
                          </div>
                          {!review.status && (
                            <div className="flex flex-col items-center space-y-3 w-full pb-8">
                              <button
                                onClick={() => setDeleteConfirm(review.id)}
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
                      {t("reviewsNav")}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {hasNextPage && (
              <div className="flex justify-center mt-8 mb-8 w-full">
                <button
                  onClick={loadMoreReviews}
                  className="bg-[#0A7D9E] text-white w-[400px] h-[54px] rounded-[32px] px-4 py-2 mx-auto"
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Загрузка..." : "Загрузить ещё"}
                </button>
              </div>
            )}
          </div>

          {isTouristModalOpen && selectedTourist && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded-[16px] shadow-lg max-h-[90vh] w-[600px] overflow-y-auto admin-scrollbar flex flex-col">
                <div className="flex items-center justify-between w-full p-4 gap-4 border-b border-[#E4E9EA] sticky top-0 bg-white z-50">
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
                <div className="flex justify-center mt-4">
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
                <h2 className="font-roboto font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4 px-4 break-words">
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
      {selectedAnnouncementId && (
        <AnnouncementModalWrapper
          announcementId={selectedAnnouncementId}
          open={isAnnouncementModalOpen}
          onClose={() => {
            setIsAnnouncementModalOpen(false);
            setSelectedAnnouncementId(null);
          }}
          onBack={() => {
            setIsAnnouncementModalOpen(false);
            setSelectedAnnouncementId(null);
          }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-[16px] shadow-lg max-w-sm w-full mx-4 flex flex-col gap-4 relative">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="absolute top-4 right-4 h-[32px] w-[32px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <img src={Close} alt="Закрыть" className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-black pr-8">
              Подтверждение удаления
            </h2>
            <p className="text-gray-600">
              Вы уверены, что хотите удалить этот отзыв? Это действие невозможно
              отменить.
            </p>
            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-gray-200 text-black px-6 py-2 rounded-[32px] font-medium hover:bg-gray-300 transition-colors"
              >
                Отменить
              </button>
              <button
                onClick={() => {
                  handleDeleteReview(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="bg-[#FF5959] text-white px-6 py-2 rounded-[32px] font-medium hover:opacity-80 transition-opacity"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент-обертка для загрузки объявления
function AnnouncementModalWrapper({
  announcementId,
  open,
  onClose,
  onBack,
}: {
  announcementId: string;
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
}) {
  const { data, isLoading } = UseGetAnnouncement(announcementId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-4">
          <Loader />
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <AdminAnnouncementModal
      announcement={data}
      open={open}
      onClose={onBack || onClose}
    />
  );
}

export default ReviewsPage;

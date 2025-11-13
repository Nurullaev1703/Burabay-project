import { FC, useEffect, useState } from "react";
import {
  Review,
  ReviewAnnouncement,
} from "../../../announcements/model/announcements";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import StarIcon from "../../../../app/icons/announcements/star.svg";
import UnfocusedStarIcon from "../../../../app/icons/announcements/unfocused-star.svg";
import ArrowIcon from "../../../../app/icons/announcements/black-arrowRight.svg";
import { baseUrl } from "../../../../services/api/ServerData";
import { TextField } from "@mui/material";
import { Loader } from "../../../../components/Loader";
import { UseGetReviews } from "../../../announcements/announcement/announcement-util";
import arrowDown from "../../../../app/icons/arrowDown.svg";
import { ImageViewModal } from "../../../announcements/reviews/ui/ImageViewModal";
import { apiService } from "../../../../services/api/ApiService";
import { queryClient } from "../../../../ini/InitializeApp";
import Close from "/Close.png?url";

interface Props {
  announcementId: string;
}

export const AdminReviewsInfo: FC<Props> = function AdminReviewsInfo({
  announcementId,
}) {
  const { t } = useTranslation();
  const { data, isLoading, refetch } = UseGetReviews(announcementId);
  const [showReviews, setShowReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<number, boolean>
  >({});
  const [imageModal, setImageModal] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    reviewId: string | null;
    reviewIndex: number | null;
  }>({ reviewId: null, reviewIndex: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const reviews: Review[] = Array.isArray(data?.reviews) ? data.reviews : [];

  const toggleReviewText = (index: number) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleDeleteReview = async (reviewId: string) => {
    setIsDeleting(true);
    try {
      const response = await apiService.delete({
        url: `/review/${reviewId}`,
      });

      if (response.status === 200) {
        // Обновляем данные после удаления
        await refetch();
        setDeleteConfirm({ reviewId: null, reviewIndex: null });
      }
    } catch (error) {
      console.error("Ошибка при удалении отзыва:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-4 mb-2">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white mb-2">
      <div className="sticky top-0 bg-white z-10 flex justify-between mb-4 items-center p-4 border-b border-[#E4E9EA]">
        <div className="flex items-center">
          <h2 className="text-[22px] font-medium mr-1">{t("reviews")}</h2>
          <button
            className="w-6 h-6 flex justify-center items-center"
            onClick={() => setShowReviews(!showReviews)}
          >
            <img src={showReviews ? arrowDown : ArrowIcon} className="mt-0.5" />
          </button>
        </div>

        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <img src={StarIcon} className="w-[16px] mr-1 mb-1" />
            <span className="mr-1">
              {data?.adAvgRating ? data.adAvgRating : 0}
            </span>
          </div>
          <div className="bg-gray-200 w-1 h-1 rounded-full mr-2"></div>
          <span className="mr-1 text-gray-500">
            {data?.adReviewCount ? data.adReviewCount : 0} {t("grades")}
          </span>
        </div>
      </div>

      {showReviews && (
        <>
          {reviews.length === 0 ? (
            <div className="flex flex-col py-4 px-4">
              <div className="text-gray-500">{t("noReviews")}</div>
            </div>
          ) : (
            <ul className="flex flex-col gap-8 px-4 pb-4">
              {/* Вывод всех отзывов для администратора */}
              {reviews.map((review, index) => (
                <li key={index} className="border-b border-[#E4E9EA] pb-4">
                  <div className="flex justify-between items-start mb-2.5 gap-4">
                    <div className="flex-1 flex flex-col min-w-0">
                      <span className="break-words whitespace-normal overflow-wrap-anywhere font-medium">
                        {review.user?.fullName || "Безымянный"}
                      </span>
                      <span className={`text-xs ${COLORS_TEXT.gray100}`}>
                        {review.date
                          ? new Date(review.date).toLocaleDateString("ru-RU", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Нет даты"}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {[...Array(5)].map((_, starIndex) => (
                        <img
                          key={starIndex}
                          src={
                            starIndex < review.stars
                              ? StarIcon
                              : UnfocusedStarIcon
                          }
                          alt={
                            starIndex < review.stars
                              ? "Активная звезда"
                              : "Неактивная звезда"
                          }
                          width={16}
                          height={16}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="leading-5 mb-2.5 break-words">
                    {expandedReviews[index] ? (
                      <>
                        {review.text}{" "}
                        <span
                          className={`${COLORS_TEXT.blue200} cursor-pointer font-semibold`}
                          onClick={() => toggleReviewText(index)}
                        >
                          {t("hide")}
                        </span>
                      </>
                    ) : (
                      <>
                        {review.text.length > 150
                          ? `${review.text.slice(0, 150)}...`
                          : review.text}{" "}
                        {review.text.length > 150 && (
                          <span
                            className={`${COLORS_TEXT.blue200} cursor-pointer font-semibold`}
                            onClick={() => toggleReviewText(index)}
                          >
                            {t("more")}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {review.images && review.images.length > 0 && (
                    <ul className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth mb-2">
                      {review.images.map((image, imgIndex) => (
                        <li key={imgIndex} className="w-20 h-20 flex-shrink-0">
                          <img
                            src={baseUrl + image}
                            alt="Изображение"
                            className="rounded-lg w-full h-full object-cover cursor-pointer"
                            onClick={() => {
                              setSelectedImages(review.images);
                              setImageIndex(imgIndex);
                              setImageModal(true);
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  {imageModal && (
                    <ImageViewModal
                      images={selectedImages.map((image, imgIndex) => {
                        return {
                          index: imgIndex,
                          imgUrl: baseUrl + image,
                        };
                      })}
                      open={imageModal}
                      onClose={() => setImageModal(false)}
                      firstItem={imageIndex}
                    />
                  )}

                  <ul className="mb-3">
                    {review.answer && (
                      <li key={`answer-${index}`}>
                        <TextField
                          value={review.answer.text}
                          sx={{
                            marginBottom: "8px",
                            border: "solid #E4E9EA 1px",
                          }}
                          variant="outlined"
                          fullWidth={true}
                          label={t("theAnswer")}
                          InputProps={{ readOnly: true }}
                        />
                      </li>
                    )}
                  </ul>

                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        reviewId: review.id,
                        reviewIndex: index,
                      })
                    }
                    className="bg-[#FF5959] text-white px-4 py-2 rounded-[32px] hover:opacity-80 transition-opacity text-sm font-medium"
                  >
                    Удалить отзыв
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {deleteConfirm.reviewId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-[16px] p-6 max-w-sm shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Подтверждение удаления</h3>
              <button
                onClick={() =>
                  setDeleteConfirm({ reviewId: null, reviewIndex: null })
                }
                className="h-[28px] w-[28px] flex items-center justify-center flex-shrink-0"
              >
                <img src={Close} alt="Закрыть" className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить этот отзыв? Это действие нельзя
              отменить.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteConfirm({ reviewId: null, reviewIndex: null })
                }
                className="px-4 py-2 border border-gray-300 rounded-[32px] hover:bg-gray-50 transition-colors font-medium"
                disabled={isDeleting}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.reviewId) {
                    handleDeleteReview(deleteConfirm.reviewId);
                  }
                }}
                className="px-4 py-2 bg-[#FF5959] text-white rounded-[32px] hover:opacity-80 transition-opacity font-medium"
                disabled={isDeleting}
              >
                {isDeleting ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

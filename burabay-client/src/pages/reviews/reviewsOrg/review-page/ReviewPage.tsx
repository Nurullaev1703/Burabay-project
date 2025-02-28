import { FC, useState } from "react";
import { ReviewAnnouncement } from "../../../announcements/model/announcements";
import { useTranslation } from "react-i18next";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { Typography } from "../../../../shared/ui/Typography";
import { COLORS_BACKGROUND, COLORS_TEXT } from "../../../../shared/ui/colors";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
import { baseUrl, HTTP_STATUS } from "../../../../services/api/ServerData";
import StarIcon from "../../../../app/icons/announcements/star.svg";
import UnfocusedStarIcon from "../../../../app/icons/announcements/unfocused-star.svg";
import WarningIcon from "../../../../app/icons/announcements/reviews/warning.svg";
import { TextField } from "@mui/material";
import { Button } from "../../../../shared/ui/Button";
import { apiService } from "../../../../services/api/ApiService";
import { queryClient } from "../../../../ini/InitializeApp";
import DefaultIcon from "../../../../app/icons/abstract-bg.svg"

interface Props {
  review: ReviewAnnouncement;
}

interface Answer {
  reviewId: string;
  text: string;
}

export const ReviewPage: FC<Props> = function ReviewPage({ review }) {
  const [reviewData, setReviewData] = useState<ReviewAnnouncement>(review);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>(
    baseUrl + reviewData.adImage
  );
  const [modalAnswer, setModalAnswer] = useState<
    Record<string, "complain" | "answer" | false>
  >({});
  const [expandedReviews, setExpandedReviews] = useState<
    Record<number, boolean>
  >({});
  const [answerText, setAnswerText] = useState<Answer>({
    reviewId: "",
    text: "",
  });

  const toggleReviewText = (index: number) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  const { t } = useTranslation();

  const handleSubmitAnswer = async (type: "complain" | "answer") => {
    try {
      setIsLoading(true);
      const response = await apiService.post<string>({
        url: `${type === "complain" ? "/review-report" : "/review-answers"}`,
        dto: answerText,
      });

      if (parseInt(response.data) !== parseInt(HTTP_STATUS.CREATED)) {
        throw new Error("Не удалось добавить ответ");
      }

      setReviewData((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === answerText.reviewId
            ? { ...r, [type === "complain" ? "report" : "answer"]: { text: answerText.text } }
            : r
        ),
      }));

      await queryClient.invalidateQueries({
        queryKey: [`/review/ad/${review.adId}`, `/ad/${review.adId}`],
      });
      setIsLoading(false);
      setAnswerText({ reviewId: "", text: "" });
      closeModal(answerText.reviewId);
    } catch (e) {
      console.error("Ошибка:", e);
    }
  };

  // Функция для открытия модалки для конкретного отзыва
  const openModal = (reviewId: string, type: "complain" | "answer") => {
    setModalAnswer((prev) => ({ ...prev, [reviewId]: type }));
  };

  // Функция для закрытия модалки
  const closeModal = (reviewId: string) => {
    setModalAnswer((prev) => ({ ...prev, [reviewId]: false }));
  };

  return (
    <section className="bg-background min-h-screen">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("С высокой оценкой")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => history.back()}
          ></IconContainer>
        </div>
      </Header>

      <div className="px-4 flex bg-white py-3 mb-2">
        <img
          src={imageSrc}
          onError={() => setImageSrc(DefaultIcon)}
          alt={reviewData.adTitle}
          className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
        />
        <div>
          <span>{review.adTitle}</span>
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              <img src={StarIcon} className="w-[16px] mr-1 mb-1" />
              <span className="mr-1">
                {reviewData.adAvgRating ? review.adAvgRating : 0}
              </span>
            </div>
            <div
              className={`${COLORS_BACKGROUND.gray100} w-1 h-1 rounded-full mr-2`}
            ></div>
            <span className={`mr-1 ${COLORS_TEXT.gray100}`}>
              {reviewData.adReviewCount ? review.adReviewCount : 0}{" "}
              {t("grades")}
            </span>
          </div>
        </div>
      </div>

      <ul className="p-4 bg-white">
        {reviewData.reviews.map((review, index) => (
          <li key={index} className="border-b border-[#E4E9EA] pb-4">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex flex-col">
                <span>
                  {review.user.fullName ? review.user.fullName : "Безымянный"}
                </span>
                <span className={`text-xs ${COLORS_TEXT.gray100}`}>
                  {review.date
                    ? new Date(review.date).toLocaleDateString()
                    : "Нет даты"}
                </span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, starIndex) => (
                  <img
                    key={starIndex}
                    src={
                      starIndex < review.stars ? StarIcon : UnfocusedStarIcon
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

            <ul className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth mb-3">
              {review.images.map((image, index) => (
                <li key={index} className="w-20 h-20 flex-shrink-0">
                  <img
                    src={baseUrl + image}
                    alt="Изображение"
                    className="rounded-lg  w-full h-full object-cover"
                  />
                </li>
              ))}
            </ul>

            <ul>
              {review.answer && (
                <li key={index}>
                  <TextField
                    value={review.answer.text}
                    sx={{ marginBottom: "8px", border: "solid #E4E9EA 1px" }}
                    variant="outlined"
                    fullWidth={true}
                    label={t("theAnswer")}
                    InputProps={{ readOnly: true }}
                  />
                </li>
              )}
              {review.report && (
                <li key={index}>
                  <TextField
                    InputLabelProps={{
                      sx: {
                        color: "red",
                        "&.Mui-focused": { color: "red" },
                      },
                    }}
                    value={review.report.text}
                    sx={{ marginBottom: "8px", border: "solid #E4E9EA 1px" }}
                    variant="outlined"
                    fullWidth={true}
                    label={t("complaint")}
                    InputProps={{ readOnly: true }}
                  />
                </li>
              )}
            </ul>

            <div className="flex justify-between mb-4">
              <img
                src={WarningIcon}
                alt="Опровергнуть"
                onClick={() => openModal(review.id, "complain")}
              />
              <span
                className={`font-semibold ${COLORS_TEXT.blue200}`}
                onClick={() => openModal(review.id, "answer")}
              >
                {t("answer")}
              </span>
            </div>
            {modalAnswer[review.id] === "answer" && (
              <div>
                <TextField
                  sx={{ marginBottom: "8px", border: "solid #E4E9EA 1px" }}
                  variant="outlined"
                  fullWidth={true}
                  label={t("yourAnswer")}
                  placeholder={t("writeAnswer")}
                  onChange={(e) =>
                    setAnswerText({
                      reviewId: review.id,
                      text: e.target.value,
                    })
                  }
                />
                <div className="flex justify-between">
                  <Button
                    className="mr-2.5"
                    mode="border"
                    onClick={() => closeModal(review.id)}
                  >
                    {t("cancelBtn")}
                  </Button>
                  <Button
                    onClick={() => handleSubmitAnswer("answer")}
                    loading={isLoading}
                  >
                    {t("answer")}
                  </Button>
                </div>
              </div>
            )}

            {modalAnswer[review.id] === "complain" && (
              <div>
                <TextField
                  sx={{ marginBottom: "8px", border: "solid #E4E9EA 1px" }}
                  variant="outlined"
                  fullWidth={true}
                  label={t("complaint")}
                  placeholder={t("writeComplaint")}
                  onChange={(e) =>
                    setAnswerText({
                      reviewId: review.id,
                      text: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    sx: {
                      color: "red",
                      "&.Mui-focused": { color: "red" },
                    },
                  }}
                />
                <div className="flex justify-between">
                  <Button
                    className="mr-2.5"
                    mode="border"
                    onClick={() => closeModal(review.id)}
                  >
                    {t("cancelBtn")}
                  </Button>
                  <Button
                    onClick={() => handleSubmitAnswer("complain")}
                    mode="error"
                    loading={isLoading}
                  >
                    {t("complain")}
                  </Button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

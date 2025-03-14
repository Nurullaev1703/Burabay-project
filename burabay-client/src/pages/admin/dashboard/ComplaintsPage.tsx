import { FC, useEffect, useState, useRef } from "react";
import SideNav from "../../../components/admin/SideNav";
import { apiService } from "../../../services/api/ApiService";
import { RatingStars } from "../../../shared/ui/RatingStars";
import { AdCard } from "../../main/ui/AdCard";
import authBg from "../../../app/icons/bg_auth.png";
import { Announcement } from "../../announcements/model/announcements";
import { baseUrl } from "../../../services/api/ServerData";
import { CoveredImage } from "../../../shared/ui/CoveredImage";
import defaultImage from "../../../app/icons/abstract-bg.svg";
import { Loader } from "../../../components/Loader";
import noComp from "../../../app/icons/noComp.svg?url";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { AdminAnnoun } from "../announcements/AdminAnnoun";

import Back from "../../../../public/Back.svg";
import Close from "../../../../public/Close.png";

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
  delayedRemoval?: boolean;
  status?: "deleted" | "accepted";
}

interface Organization {
  id: string;
  name: string;
  description: string;
  imgUrl: string;
  website?: string;
  phone?: string;
  user: { id: string; email: string }; // Добавьте id здесь
  ads: Announcement[];
}

// export enum ROLE_TYPE {
//   ADMIN = "ADMIN",
//   MODERATOR = "MODERATOR",
//   TOURIST = "TOURIST",
// }

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  isEmailConfirmed: boolean;
  organization: Organization;
  phoneNumber: string;
  picture: string;
  isBanned: boolean;
}

// interface ComplaintsPageProps {
//   profile: Profile;
//   users: Profile;
// }

export const ComplaintsPage: FC = function ComplaintsPage({}) {
  const [reviews, setReviews] = useState<
    (Review & {
      hint: { message: string; type: "success" | "error" } | null;
      delayedRemoval?: boolean;
      status?: "deleted" | "accepted";
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(20);
  const navigate = useNavigate();
  const [selectedAd, setSelectedAd] = useState<Announcement | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiService.get<Review[]>({
          url: "/admin/reports",
        });

        if (response.status === 200) {
          setReviews(
            response.data.map((review) => ({
              ...review,
              hint: null,
              delayedRemoval: false,
              status: undefined,
            }))
          );
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

    const intervalId = setInterval(fetchReviews, 15000); // Обновление каждые 15 секунд

    return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteReview = async (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.reviewId === reviewId
          ? {
              ...review,
              hint: {
                message: "Отзыв будет удален через 15 секунд",
                type: "success",
              },
              delayedRemoval: true,
              status: "deleted",
            }
          : review
      )
    );

    if (timers.current[reviewId]) {
      clearTimeout(timers.current[reviewId]);
    }

    timers.current[reviewId] = setTimeout(async () => {
      try {
        const response = await apiService.delete({
          url: `/review/${reviewId}`,
        });
        if (response.status === 200) {
          setReviews((prevReviews) =>
            prevReviews.filter((review) => review.reviewId !== reviewId)
          );
        }
      } catch (error) {
        console.error("Ошибка удаления отзыва:", error);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.reviewId === reviewId
              ? {
                  ...review,
                  hint: {
                    message: "Ошибка при удалении отзыва",
                    type: "error",
                  },
                  delayedRemoval: false,
                  status: undefined,
                }
              : review
          )
        );
      } finally {
        delete timers.current[reviewId];
      }
    }, 10000);
  };

  const handleAcceptReview = async (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.reviewId === reviewId
          ? {
              ...review,
              hint: {
                message:
                  "Отзыв будет принят через 15 секунд. Нажмите Отменить, чтобы восстановить.",
                type: "success",
              },
              delayedRemoval: true,
              status: "accepted",
            }
          : review
      )
    );

    if (timers.current[reviewId]) {
      clearTimeout(timers.current[reviewId]);
    }

    timers.current[reviewId] = setTimeout(async () => {
      try {
        const response = await apiService.patch({
          url: `/admin/check-review/${reviewId}`,
          dto: {},
        });
        if (response.status === 200) {
          setReviews((prevReviews) =>
            prevReviews.filter((review) => review.reviewId !== reviewId)
          );
          delete timers.current[reviewId];
        }
      } catch (error) {
        console.error("Ошибка принятия отзыва:", error);
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.reviewId === reviewId
              ? {
                  ...review,
                  hint: {
                    message: "Ошибка при принятии отзыва",
                    type: "error",
                  },
                  delayedRemoval: false,
                  status: undefined,
                }
              : review
          )
        );
      } finally {
        delete timers.current[reviewId];
      }
    }, 10000);
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

  const handleCancelHint = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.reviewId === reviewId
          ? {
              ...review,
              hint: null,
              status: undefined,
              delayedRemoval: false,
            }
          : review
      )
    );
    if (timers.current[reviewId]) {
      clearTimeout(timers.current[reviewId]);
      delete timers.current[reviewId];
    }
  };

  const loadMoreReviews = () => {
    setVisibleReviewsCount((prevCount) => prevCount + 20);
  };

  const handleBlockUser = async (orgId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-org/${orgId}`,
        dto: { value: true },
      });
      if (response.status === 200) {
        alert("Пользователь заблокирован");
        setIsModalOpen(false);
      } else {
        alert("Ошибка при блокировке пользователя");
      }
    } catch (error) {
      console.error("Ошибка блокировки пользователя:", error);
      alert("Произошла ошибка при блокировке пользователя");
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      const response = await apiService.patch({
        url: `/admin/ban-org/${userId}`,
        dto: { value: false },
      });
      if (response.status === 200) {
        alert("Пользователь разблокирован");
        setIsModalOpen(false);
      } else {
        alert("Ошибка при разблокировке пользователя");
      }
    } catch (error) {
      console.error("Ошибка разблокировки пользователя:", error);
      alert("Произошла ошибка при разблокировке пользователя");
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
        <SideNav />
      </div>
      <div className="flex-1 flex flex-col  items-center px-2 transition-all duration-300 ease-linear ml-[94px]">
        {reviews.length > 0 && (
          <div className="h-[68px] grid grid-cols-[1fr_1fr_332px] w-full border-[2px] border-[#E4E9EA] bg-white font-roboto rounded-b-[16px]">
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
        )}
        <div
          className="w-full flex flex-col py-[10px] gap-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 68px)" }}
        >
          {isLoading ? (
            <Loader />
          ) : reviews.length > 0 ? (
            <>
              {reviews.slice(0, visibleReviewsCount).map((review) => (
                <div
                  key={review.reviewId}
                  className={`grid grid-cols-[1fr_1fr_332px] max-h-[330px] rounded-[16px] ${
                    review.hint
                      ? review.hint.type === "success"
                        ? "bg-[#59C183]"
                        : "bg-[#FF5959]"
                      : "bg-white"
                  }`}
                >
                  {review.status ? (
                    <div
                      className={`col-span-3 flex items-center justify-between rounded-[16px] px-4 py-2 ${
                        review.status === "deleted"
                          ? "bg-[#FF5959]"
                          : "bg-[#59C183]"
                      }`}
                    >
                      <div className="p-2 text-white rounded">
                        {review.status === "deleted"
                          ? "Комментарий удален"
                          : "Комментарий оставлен"}
                      </div>
                      <button
                        onClick={() => handleCancelHint(review.reviewId)}
                        className={`p-2 text-white rounded bg-inherit ${
                          review.status === "deleted"
                            ? "bg-[#FF5959]"
                            : "bg-[#59C183]"
                        }`}
                      >
                        Отменить
                      </button>
                    </div>
                  ) : (
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

                        <div className="flex items-center">
                          <img
                            src={`${BASE_URL}${review.adImage}`}
                            alt="Фото курорта"
                            className="w-[52px] h-[52px] rounded-md object-cover"
                            onError={(e) =>
                              (e.currentTarget.src = defaultImage)
                            }
                          />
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700">
                              {review.adName}
                            </p>
                            <div className="text-[16px] text-black flex items-center">
                              ⭐ {review.adRating} ·{" "}
                              <span className="text-gray-500">
                                &nbsp;{review.adReviewCount} оценок
                              </span>
                            </div>
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
                              alt="Фото орагнизации"
                              className="w-[80px] h-[80px] rounded-md object-cover"
                              onError={(e) =>
                                (e.currentTarget.src = defaultImage)
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!review.status && (
                    <>
                      <div className="border-r border-gray-300 p-[32px] flex flex-col">
                        <div className="flex items-center gap-3">
                          <img
                            src={`${BASE_URL}${review.orgImage}`}
                            alt="Лого"
                            className="w-[40px] h-[40px] rounded-full object-cover bg-gray-200"
                            onError={(e) =>
                              (e.currentTarget.src = defaultImage)
                            }
                          />

                          <div>
                            {review.orgName ? (
                              <p
                                className="font-semibold cursor-pointer text-blue-500"
                                onClick={() =>
                                  fetchOrgInfo(
                                    review.orgId ||
                                      "3db2a1cd-e76f-4144-9f21-3b58f1c72623"
                                  )
                                }
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
                        <button
                          onClick={() => handleAcceptReview(review.reviewId)}
                          className="bg-[#39B56B] max-w-[400px] w-[268px] h-[54px] rounded-[32px] text-white py-2 text-sm md:text-base hover:opacity-80 cursor-pointer"
                        >
                          Оставить отзыв
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.reviewId)}
                          className="bg-[#FF5959] max-w-[400px] w-[268px] h-[54px] rounded-[32px] text-white px-4 py-2 text-sm md:text-base hover:opacity-80 cursor-pointer"
                        >
                          Удалить отзыв
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {visibleReviewsCount < reviews.length && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={loadMoreReviews}
                    className="bg-[#0A7D9E] text-white px-4 py-2 rounded-lg"
                  >
                    Загрузить еще
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full absolute inset-0 pointer-events-none">
              <div className="flex flex-col items-center bg-white/75 blur-10 justify-center h-[278px] w-[358px] rounded-lg pointer-events-auto">
                <img
                  src={noComp}
                  alt="Нет жалоб"
                  className="w-[150px] h-[150px] mb-4"
                />
                <p className="text-center text-black text-lg">Жалоб пока нет</p>
              </div>
            </div>
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
                <img src={Back} alt="Назад" className="w-6 h-6" />
              </button>
              <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] leading-[20px] tracking-[0.4px] text-center flex-grow">
                Организация
              </h2>
              <button
                className="h-[44px] w-[44px]"
                onClick={() => setIsModalOpen(false)}
              >
                <img src={Close} alt="Выход" className="w-full h-full" />
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
            <h2 className="font-roboto font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4">
              {selectedOrg.name}
            </h2>
            <p className="font-roboto font-normal text-[16px] leading-[20px] tracking-[0.4px] text-left text-black mt-2">
              {selectedOrg.description || "Описание отсутствует"}
            </p>
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
                    {selectedOrg.phone || "Не указано"}
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
            {selectedOrg.ads.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedOrg.ads.map((ad, index) => (
                  <div
                    onClick={() =>
                      navigate({
                        to: `/admin/announcements/${ad.id}`,
                      })
                    }
                  >
                    <AdCard key={index} ad={ad} isOrganization={true} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Нет объявлений</p>
            )}
            <div className="flex flex-col items-center gap-4">
              <div>
                <button
                  className="bg-white text-[#FF4545] border-[3px] font-medium border-[#FF4545] px-4 py-2 w-[400px] h-[54px] rounded-[32px] z-10"
                  onClick={() => {
                    handleBlockUser(selectedOrg.id);
                  }}
                >
                  Заблокировать пользователя
                </button>
              </div>
              <div>
                <button
                  className="bg-[#39B56B] text-white px-4 py-2 font-medium w-[400px] h-[54px] rounded-[32px] z-10"
                  onClick={() => {
                    handleUnblockUser(selectedOrg.id);
                  }}
                >
                  Разблокировать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;

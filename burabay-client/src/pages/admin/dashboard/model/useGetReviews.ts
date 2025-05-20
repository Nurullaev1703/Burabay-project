import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../../../../services/api/ApiService";
import { useEffect, useRef, useState } from "react";

export interface ReviewsFilter {
  search?: string;
  skip?: number;
  take?: number;
}

const REVIEWS_DELETION_TIMERS_KEY = "reviewsDeletionTimers";
const DELETION_TIMEOUT = 4000;

export function useGetReviews(filters: ReviewsFilter) {
  const take = filters.take ?? 8;
  const search = filters.search ?? "";
  const queryClient = useQueryClient();
  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const [reviewHints, setReviewHints] = useState<
    Record<string, { message: string; type: string; status?: string }>
  >({});

  const saveTimerToLocalStorage = (reviewId: string, expiryTime: number) => {
    const storedTimers = JSON.parse(
      localStorage.getItem(REVIEWS_DELETION_TIMERS_KEY) || "{}"
    );
    storedTimers[reviewId] = expiryTime;
    localStorage.setItem(
      REVIEWS_DELETION_TIMERS_KEY,
      JSON.stringify(storedTimers)
    );
  };

  const removeTimerFromLocalStorage = (reviewId: string) => {
    const storedTimers = JSON.parse(
      localStorage.getItem(REVIEWS_DELETION_TIMERS_KEY) || "{}"
    );
    delete storedTimers[reviewId];
    localStorage.setItem(
      REVIEWS_DELETION_TIMERS_KEY,
      JSON.stringify(storedTimers)
    );
  };

  const handleDeleteReviewInternal = async (reviewId: string) => {
    try {
      const response = await apiService.delete({
        url: `/review/${reviewId}`,
      });
      if (response.status === 200) {
        queryClient.setQueryData(["admin-reviews", filters], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any[]) =>
              page.filter((review: any) => review.id !== reviewId)
            ),
          };
        });
        setReviewHints((prev) => {
          const copy = { ...prev };
          delete copy[reviewId];
          return copy;
        });
        removeTimerFromLocalStorage(reviewId);
      }
    } catch (error) {
      setReviewHints((prev) => ({
        ...prev,
        [reviewId]: {
          message: "Ошибка при удалении отзыва",
          type: "error",
        },
      }));
      removeTimerFromLocalStorage(reviewId);
    } finally {
      delete timers.current[reviewId];
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviewHints((prev) => ({
      ...prev,
      [reviewId]: {
        message: "Отзыв будет удален через 10 секунд",
        type: "success",
        status: "pending",
      },
    }));

    const expiryTime = Date.now() + DELETION_TIMEOUT;
    saveTimerToLocalStorage(reviewId, expiryTime);

    if (timers.current[reviewId]) {
      clearTimeout(timers.current[reviewId]);
    }

    timers.current[reviewId] = setTimeout(
      () => handleDeleteReviewInternal(reviewId),
      DELETION_TIMEOUT
    );
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
    removeTimerFromLocalStorage(reviewId);
  };

  useEffect(() => {
    const storedTimers = JSON.parse(
      localStorage.getItem(REVIEWS_DELETION_TIMERS_KEY) || "{}"
    );
    const now = Date.now();

    for (const reviewId in storedTimers) {
      const expiryTime = storedTimers[reviewId];
      if (expiryTime <= now) {
        handleDeleteReviewInternal(reviewId);
        removeTimerFromLocalStorage(reviewId);
      } else {
        const timeLeft = expiryTime - now;
        setReviewHints((prev) => ({
          ...prev,
          [reviewId]: {
            message: `Отзыв будет удален через ${Math.ceil(
              timeLeft / 1000
            )} секунд`,
            type: "success",
            status: "pending",
          },
        }));
        timers.current[reviewId] = setTimeout(
          () => handleDeleteReviewInternal(reviewId),
          timeLeft
        );
      }
    }

    return () => {
      for (const timerId in timers.current) {
        clearTimeout(timers.current[timerId]);
      }
    };
  }, [filters, queryClient]);

  const queryResult = useInfiniteQuery({
    queryKey: ["admin-reviews", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get<any[]>({
        url: `/review/all?skip=${pageParam}&take=${take}&search=${search}`,
      });
      return response.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === take ? allPages.length * take : undefined;
    },
  });

  return {
    ...queryResult,
    handleDeleteReview,
    handleCancelHint,
    reviewHints,
  };
}

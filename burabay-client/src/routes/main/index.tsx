import { createFileRoute } from "@tanstack/react-router";
import { Main } from "../../pages/main/Main";
import { Loader } from "../../components/Loader";
import {
  useGetMainPageCategories,
  useGetMainPageBanners,
  useGetMainPageAnnouncements,
  useGetRecommendedAds,
} from "../../pages/main/main-utils";
import { MainPageFilter } from "../../pages/main/model/mainpage-types";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/main/")({
  component: MainRoute,
  validateSearch: () => ({}) as MainPageFilter,
});

function MainRoute() {
  const filters = Route.useSearch();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetMainPageCategories();
  const { data: bannersData, isLoading: isBannersLoading } =
    useGetMainPageBanners();
  const announcementsQuery = useGetMainPageAnnouncements(filters);
  const recommendedQuery = useGetRecommendedAds(filters);

  // Показываем лоадер пока загружаются все критичные данные
  const isLoading =
    isCategoriesLoading ||
    isBannersLoading ||
    announcementsQuery.isLoading ||
    recommendedQuery.isLoading;

  const hasRestoredScroll = useRef(false);

  // Отключаем автоматическое восстановление скролла браузером
  useEffect(() => {
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    return () => {
      if (history.scrollRestoration) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (
    categoriesData &&
    bannersData !== undefined &&
    announcementsQuery.data &&
    recommendedQuery.data
  ) {
    return (
      <Main
        categories={categoriesData.categories}
        favouriteCategories={categoriesData.favouriteCategories}
        banners={bannersData}
        filters={filters}
        announcementsData={announcementsQuery}
        recommendedData={recommendedQuery}
      />
    );
  }
}

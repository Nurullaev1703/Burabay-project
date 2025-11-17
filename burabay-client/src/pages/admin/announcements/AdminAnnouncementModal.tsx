import { FC, useState } from "react";
import { Announcement as AnnouncementType } from "../../announcements/model/announcements";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import {
  categoryBgColors,
  COLORS_BACKGROUND,
  COLORS_TEXT,
} from "../../../shared/ui/colors";
import { Carousel, CarouselItem } from "../../../components/Carousel";
import { baseUrl } from "../../../services/api/ServerData";
import { apiService } from "../../../services/api/ApiService";
import { queryClient } from "../../../ini/InitializeApp";
import { AnnouncementInfoList } from "../../announcements/announcement/ui/AnnouncementInfoList";
import { CostInfoList } from "../../announcements/announcement/ui/CostInfoList";
import { AdminReviewsInfo } from "./ui/AdminReviewsInfo";
import { Button } from "../../../shared/ui/Button";
import { ModalDelete } from "../../announcements/announcement/ui/ModalDelete";

import Close from "/Close.png?url";
import Back from "/Back.svg?url";

interface Props {
  announcement: AnnouncementType;
  open: boolean;
  onClose: () => void;
}

export const formatPrice = (value: number) => {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₸";
};

export const AdminAnnouncementModal: FC<Props> =
  function AdminAnnouncementModal({ announcement, open, onClose }) {
    const { t } = useTranslation();
    const [carouselImages] = useState<CarouselItem[]>(
      announcement.images.map((image, index) => {
        return {
          imgUrl: baseUrl + image,
          index,
        };
      })
    );
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    if (!open) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-[16px] max-h-[90vh] shadow-lg w-[600px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 sticky top-0 bg-white border-b border-[#E4E9EA] z-10">
            <button
              className="h-[44px] w-[44px] flex items-center justify-center flex-shrink-0"
              onClick={onClose}
            >
              <img src={Back} alt="Назад" className="w-6 h-6" />
            </button>
            <h2 className="font-roboto font-medium text-[#0A7D9E] text-[18px] leading-[20px] tracking-[0.4px] text-center flex-grow">
              {t("ad")}
            </h2>
            <button
              className="h-[44px] w-[44px] flex items-center justify-center flex-shrink-0"
              onClick={onClose}
            >
              <img src={Close} alt="Закрыть" className="w-full h-full" />
            </button>
          </div>

          <div className="overflow-y-auto admin-scrollbar flex-1 flex flex-col">
            <div className="p-4">
              <div className="relative mb-4">
                <div
                  className={`absolute w-7 h-7 rounded-full ${categoryBgColors[announcement.subcategory.category.name]} z-10 right-2.5 top-2.5`}
                >
                  <img
                    src={baseUrl + announcement.subcategory.category.imgPath}
                    alt="Категория"
                    className="absolute top-1/2 left-1/2 w-4 h-4 mr-2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen z-100"
                  />
                </div>
                <Carousel
                  items={carouselImages}
                  ratio="aspect-[4/3]"
                  height="h-full"
                />
              </div>

              <div className="flex items-center justify-between mb-3">
                <h1 className="font-medium text-[20px] capitalize text-blue200">
                  {announcement.price || announcement.priceForChild
                    ? formatPrice(
                        announcement.price || announcement.priceForChild
                      )
                    : t("free")}
                </h1>
              </div>

              <h1 className="font-medium text-[18px] truncate mb-2">
                {announcement.title}
              </h1>

              <div className="flex justify-between mb-3 items-center">
                <span className="text-sm">
                  {t("duration") +
                    " — " +
                    (announcement.duration
                      ? announcement.duration
                      : t("notSpecified"))}
                </span>
              </div>

              <p className="mb-3 leading-5 break-words whitespace-pre-wrap text-sm">
                {announcement.description}
              </p>

              <div className="mb-4 border-t border-[#E4E9EA] pt-3">
                <AnnouncementInfoList ad={announcement} isAdmin={true} />
              </div>

              <CostInfoList ad={announcement} />

              <AdminReviewsInfo announcementId={announcement.id} />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-[#E4E9EA] p-4 z-10">
            <Button
              mode="red"
              onClick={() => setShowDeleteModal(true)}
              className="border-2 border-red w-full"
            >
              {"Удалить объявление"}
            </Button>
          </div>

          {showDeleteModal && (
            <ModalDelete
              isAdmin
              open={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              adId={announcement.id}
            />
          )}
        </div>
      </div>
    );
  };

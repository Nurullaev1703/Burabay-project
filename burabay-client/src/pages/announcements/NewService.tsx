import { FC, useState } from "react";
import { Header } from "../../components/Header";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import { ProgressSteps } from "./ui/ProgressSteps";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Modal, Switch } from "@mui/material";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { apiService } from "../../services/api/ApiService";
import { useTranslation } from "react-i18next";
import { Announcement } from "./model/announcements";

interface Props {
  adId: string;
  announcement?: Announcement;
}

export const NewService: FC<Props> = function NewService({
  adId,
  announcement,
}) {
  const [showModal, setShowModal] = useState(false);
  const [unlimitedClients, setUnlimitedClients] = useState(
    announcement?.unlimitedClients || false
  );
  const { t } = useTranslation();
  const [adultsCount, setAdultsCount] = useState(
    announcement?.adultsNumber || 0
  );
  const [childrenCount, setChildrenCount] = useState(
    announcement?.kidsNumber || 0
  );
  const [ageLimit, setAgeLimit] = useState(announcement?.kidsMinAge || 0);
  const [petsAllowed, setPetsAllowed] = useState(
    announcement?.petsAllowed || false
  );
  const isButtonDisabled = !unlimitedClients && adultsCount === 0;
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const response = await apiService.patch({
      url: `/ad/${adId}`,
      dto: {
        unlimitedClients: unlimitedClients,
        adultsNumber: adultsCount,
        kidsNumber: childrenCount,
        kidsMinAge: ageLimit,
        petsAllowed: petsAllowed,
      },
    });
    if (response.data) {
      navigate({
        to: "/announcements/priceService/$adId",
        params: {
          adId: adId,
        },
      });
    }
  };
  const checkPeople = () => {
    if (
      announcement?.adultsNumber ||
      announcement?.kidsNumber ||
      announcement?.kidsMinAge ||
      announcement?.petsAllowed ||
      announcement?.unlimitedClients
    ) {
      return true;
    }
    return false;
  };
  return (
    <main className="min-h-screen mb-20">
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
              {checkPeople() ? t("changeAd") : t("newService")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => setShowModal(true)}
          >
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={8} totalSteps={9} />
      </Header>
      {showModal && (
        <Modal className="flex w-full h-full justify-center items-center p-4" open={showModal} onClose={() => setShowModal(false)}>
          <div className="relative w-full flex flex-col bg-white p-4 rounded-lg">
          <Typography size={16} weight={400} className="text-center">
            {t("confirmDelete")}
          </Typography>
          <div onClick={() => setShowModal(false)} className="absolute right-[-2px] top-[-2px] p-4">
          <img src={XIcon} className="w-[15px]" alt="" />
          </div>
          <div className="flex flex-col w-full px-4 justify-center mt-4">
            <Button className="mb-2" onClick={() => navigate({
              to: "/announcements"
            })}>{t("publish")}</Button>
              <Button mode="red" className="border-2 border-red" onClick={ async () =>{
              await apiService.delete({
                url: `/ad/${adId}`
              })
              navigate({
                to: "/announcements"
              })
            }
            }>{t("delete")}</Button>
          </div>
          </div>
        </Modal>
      )}
      <div className="p-4 space-y-6 ">
        {/* блок c клиентами */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Typography
              size={16}
              weight={400}
              className="mb-1 tracking-[0.02em]"
            >
              {t("countClient")}
            </Typography>
            <Typography
              size={12}
              weight={400}
              color={COLORS_TEXT.gray100}
              className=""
            >
              {t("clientsService")}
            </Typography>
          </div>

          <Switch
            checked={unlimitedClients}
            onChange={() => setUnlimitedClients(!unlimitedClients)}
            className="sr-only"
          />
        </div>

        {/* Блок Взрослые */}
        {!unlimitedClients && (
          <div>
            <Typography size={16} weight={400} className="mb-1">
              {t("adultsService")}
            </Typography>
            <Typography
              size={12}
              weight={400}
              color={COLORS_TEXT.gray100}
              className="mt-1"
            >
              {t("maximumAdults")}
            </Typography>
            <div className="flex justify-between items-center border-b pb-2 w-[90%] mt-2">
              <Typography size={12} weight={400}>
                {t("countAdult")}
              </Typography>
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 items-center flex justify-center"
                  onClick={() =>
                    setAdultsCount((prev) => Math.max(0, prev - 1))
                  }
                >
                  <button className="text-2xl">—</button>
                </div>
                <Typography
                  size={16}
                  weight={400}
                  className="border-b w-[72px] text-center"
                >
                  {adultsCount}
                </Typography>
                <div
                  className="w-11 h-11 items-center flex justify-center"
                  onClick={() => setAdultsCount((prev) => prev + 1)}
                >
                  <button className="text-2xl">+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Блок Дети */}
        {!unlimitedClients && (
          <div>
            <Typography size={16} weight={400} className="mb-1">
              {t("child")}
            </Typography>
            <Typography
              size={12}
              weight={400}
              color={COLORS_TEXT.gray100}
              className="mb-2 mt-1"
            >
              {t("maxchild")}
            </Typography>
            <div className="flex justify-between items-center border-b pb-2 w-[90%]">
              <Typography size={12} weight={400} className="">
                {t("countAdult")}
              </Typography>
              <div className="flex  items-center gap-2">
                <div
                  className="w-11 h-11 items-center flex justify-center"
                  onClick={() =>
                    setChildrenCount((prev) => Math.max(0, prev - 1))
                  }
                >
                  <button className="text-2xl">—</button>
                </div>
                <Typography
                  size={16}
                  weight={400}
                  className="border-b w-[72px] text-center"
                >
                  {childrenCount}
                </Typography>
                <div
                  className="w-11 h-11 items-center flex justify-center"
                  onClick={() => setChildrenCount((prev) => prev + 1)}
                >
                  <button className="text-2xl">+</button>
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center border-b pb-2 w-[90%]">
              <Typography size={12} weight={400} className="">
                {t("ageUpTo")}
              </Typography>
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 items-center flex justify-center"
                  onClick={() => setAgeLimit((prev) => Math.max(1, prev - 1))}
                >
                  <button className="text-2xl">—</button>
                </div>
                <Typography
                  size={16}
                  weight={400}
                  className="border-b w-[72px] text-center"
                >
                  {ageLimit}
                </Typography>
                <div
                  className="w-11 h-11 items-center flex justify-center"
                  onClick={() => setAgeLimit((prev) => prev + 1)}
                >
                  <button className="text-2xl">+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* в мире животных */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Typography size={16} weight={400} className="mb-1">
              {t("animalCan")}
            </Typography>
            <Typography
              size={12}
              weight={400}
              color={COLORS_TEXT.gray100}
              className=""
            >
              {t("petsAreAllowed")}
            </Typography>
          </div>
          <Switch
            checked={petsAllowed}
            onChange={() => setPetsAllowed(!petsAllowed)}
            className="sr-only"
          />
        </div>
      </div>
      <div className="fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full z-10">
        <Button
          onClick={handleSubmit}
          mode="default"
          disabled={isButtonDisabled}
        >
          {t("continueBtn")}
        </Button>
      </div>

    </main>
  );
};

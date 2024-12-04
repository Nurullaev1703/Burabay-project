import { FC } from "react";
import { Button } from "../../shared/ui/Button";
import { Carousel, CarouselItem } from "../../components/Carousel";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import WaitingImage from "../../app/img/what-next/waiting.png"
import ContractsImage from "../../app/img/what-next/contracts.png"
import ContractsImage2 from "../../app/img/what-next/contracts2.png"

export const WhatNext: FC = function WhatNext() {
  const navigate = useNavigate();
  const { t } = useTranslation()
  const CAROUSEL_IMAGES: CarouselItem[] = [
    {
      index: 0,
      imgUrl: WaitingImage
    },
    {
      index: 1,
      imgUrl: ContractsImage
    },
    {
      index: 2,
      imgUrl: ContractsImage2
    },
  ]

  return (
    <div className="flex flex-col h-screen justify-between py-4">
      <div className="px-2">
        <Carousel height="h-[80vh]" items={CAROUSEL_IMAGES}></Carousel>
      </div>

      <div className={"mb-4 px-4"}>
        <Button onClick={() => navigate({ to: "/profile" })}>
          {t('continue')}
        </Button>
      </div>
    </div>
  );
};

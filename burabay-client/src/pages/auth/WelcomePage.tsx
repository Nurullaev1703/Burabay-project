import { FC, useEffect, useState } from "react";
import { TabMenu, TabMenuItem } from "../../shared/ui/TabMenu";
import { Hint } from "../../shared/ui/Hint";
import { Header } from "../../components/Header";
import { Button } from "../../shared/ui/Button";
import { Carousel, CarouselItem } from "../../components/Carousel";
import { Link } from "@tanstack/react-router";
import { Typography } from "../../shared/ui/Typography";
import { phoneService } from "../../services/storage/Factory";
import { useTranslation } from "react-i18next";
import LanguageToggleButton from "../../shared/ui/LanguageToggleButton";
import OnlineOrder from "../../app/img/online-orders.png"
import OnlineContract from "../../app/img/online-contract.png"
import AboutService from "../../app/img/about-service.png"


export const WelcomePage: FC = function WelcomePage() {
  // текущее состояние переключателя
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const {t} = useTranslation()

  // данные для слайдера
  const CAROUSEL_ITEMS: CarouselItem[] = [
    {
      index: 0,
      imgUrl: AboutService
    },
    {
      index: 1,
      imgUrl: OnlineOrder
    },
    {
      index: 2,
      imgUrl: OnlineContract
    },

  ]
  // данные для заполнения переключателя
  const TABS_DATA: TabMenuItem[] = [
    {
      index: 0,
      title: t('buyer'),
    },
    {
      index: 1,
      title: t('provider'),
    },
  ];
  useEffect(()=> {
    phoneService.setValue("")
  }, [])
  
  return (
    <div className="px-4">
      <Header className="flex justify-between items-center">
        <div className="w-11"></div>
        <Typography size={20} weight={800} align="center">
          {t('welcome')}
        </Typography>
        <LanguageToggleButton />
      </Header>
      {/* Необходимо дополнить карусель, так как на данный момент тут нет картинок */}
      <div className="flex flex-col h-view mt-18 justify-between">
          <Carousel height="h-[60vh]" items={CAROUSEL_ITEMS}/>
          <div className="mt-4 mb-5">
            <TabMenu
              data={TABS_DATA}
              activeIndex={activeIndex}
              onChangeIndex={setActiveIndex}
              className={"mb-2"}
              
            /> 
            {/* Подсказка принимает только title для отображения */}
            <Hint
              title={
                activeIndex === 0
                  ? t('buyerHint')
                  : t('providerHint')
              }
            />
          </div>
          {/* В зависимости от выбранной роли используем разные маршруты */}
          <Link to={activeIndex === 0 ? "/auth/client" : "/auth/provider"}>
            <Button>{t('continue')}</Button>
          </Link>
      </div>
    </div>
  );
};


import { FC, useState } from "react";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Loader } from "../../components/Loader";
import { useTranslation } from "react-i18next";
import BackIcon from "../../app/icons/back-icon-white.svg"
import language from "../../app/icons/language.svg"
import { COLORS_TEXT } from "../../shared/ui/colors";
import RightArrow from "../../app/icons/announcements/arrowRight.svg"
import Union from "../../app/icons/Union.svg"

export const HelpPage: FC = function HelpPage() {
  const { history } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();


  return (
    <div className=" min-h-screen">
      <AlternativeHeader>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={700} color={COLORS_TEXT.white}>
            {"О сервисе"}
          </Typography>
          <IconContainer align="end">
            <img src={language} alt="" />
          </IconContainer>
        </div>
      </AlternativeHeader>
      <main className="p-4">
        <div onClick={() => navigate({
          to: `/help/ServiceHelp`,
        })} className="flex justify-between items-center border-b pb-3 mb-4">
          <Typography size={16} weight={400}>{"О сервисе"}</Typography>
          <img src={RightArrow} className="w-4 h-4" alt="" />
        </div>
        <div onClick={() => navigate({
          to: `/help/PolitikHelp`,
        })} className="flex justify-between items-center border-b pb-3 mb-4">
          <Typography size={16} weight={400}>{"Политика конфеденциальности"}</Typography>
          <img src={RightArrow} className="w-4 h-4" alt="" />
        </div>
        <div onClick={() => navigate({
          to: `/help/TermsOfUse`,
        })} className="flex justify-between items-center border-b pb-3 mb-4">
          <Typography size={16} weight={400}>{"Условия использования"}</Typography>
          <img src={RightArrow} className="w-4 h-4" alt="" />
        </div>
        <div className="flex gap-2 items-center border-b pb-3 mb-4">
          <img src={Union} alt="" />
          <Typography size={16} weight={400}>{"Помощь"}</Typography>
        </div>
        
        {isLoading && <Loader />}
      </main>
    </div>
  );
};

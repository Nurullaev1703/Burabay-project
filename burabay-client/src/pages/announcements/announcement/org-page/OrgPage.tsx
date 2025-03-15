import { FC } from "react";
import { AdCard } from "../../../main/ui/AdCard";
import { CoveredImage } from "../../../../shared/ui/CoveredImage";
import { baseUrl } from "../../../../services/api/ServerData";
import DefaultImage from "../../../../app/icons/abstract-bg.svg";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import { Typography } from "../../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
import CloseIcon from "../../../../app/icons/announcements/reviews/close.svg";
import ConfirmedIcon from "../../../../app/icons/profile/confirmed.svg";
import { useNavigate } from "@tanstack/react-router";
import { OrgInfo } from "../../model/announcements";

interface Props {
  org: OrgInfo;
}

export const OrgPage: FC<Props> = function OrgPage({ org }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-background rounded-lg">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div className="flex">
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
              className="mr-2"
            >
              {t("organization")}
            </Typography>
            {org.isConfirmed && <img src={ConfirmedIcon} alt="Подтверждено" />}
          </div>
          <IconContainer align="end" action={() => history.back()}>
            {" "}
            <img src={CloseIcon} alt="" />
          </IconContainer>
        </div>
      </Header>

      <div className="px-4 bg-white">
        <div className="flex justify-center px-4 ">
          <CoveredImage
            width="w-[128px]"
            height="h-[128px]"
            borderRadius="rounded-full"
            imageSrc={`${baseUrl}${org.imgUrl}`}
            errorImage={DefaultImage}
          />
        </div>
        <h1 className="font-medium text-black text-[18px] leading-[20px] tracking-[0.4px] text-center mt-4">
          {org.name}
        </h1>
        <p className="text-[16px] leading-[20px] tracking-[0.4px] text-left text-black mt-2">
          {org.description || "Описание отсутствует"}
        </p>
        <div className="mt-4 pb-4 mb-2">
          <div className="w-[726px] h-[62px] flex items-center border-t border-[#E4E9EA] gap-3">
            <div className="flex flex-col items-start">
              <p className="  text-[16px] leading-[20px] tracking-[0.4px] text-black">
                {org.siteUrl || t("notSpecified")}
              </p>
              <strong className="text-[12px] leading-[14px] tracking-[0.4px] text-[#999999]">
                {t("site")}
              </strong>
            </div>
          </div>
        </div>
      </div>
      {org.ads.length > 0 ? (
        <div className="mt-2 grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-2 mb-navContent bg-white p-4">
          {org.ads.map((ad, index) => (
            <div
              onClick={() =>
                navigate({
                  to: `/announcements/${ad.id}`,
                })
              }
            >
              <AdCard key={index} ad={ad} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{t("emptyAd")}</p>
      )}
    </div>
  );
};

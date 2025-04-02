import { FC } from "react";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/back-icon-white.svg"
import { COLORS_TEXT } from "../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import { LanguageButton } from "../../shared/ui/LanguageButton";

interface Props {

}

export const PolitikHelp: FC<Props> = function PolitikHelp() {
  const {t} = useTranslation()
  return (
    <main>
    <AlternativeHeader isMini>
    <div className="flex justify-between items-center">
      <IconContainer align="start" action={() => history.back()}>
        <img src={BackIcon} alt="" />
      </IconContainer>
      <Typography size={20} weight={700} color={COLORS_TEXT.white}>
        {t("politikHelp")}
      </Typography>
      <LanguageButton />
    </div>
  </AlternativeHeader>

  <div>
  <div className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
      <Typography className="text-black">{t("sectionGeneral")}</Typography>
      <Typography className="text-black mt-4">
      {t("sectionGeneralText1")}
      </Typography>
      <Typography className="text-black mt-2">
      {t("sectionGeneralText2")}
      </Typography>

      <Typography className="text-black  mt-6">{t("sectionDataCollection")}</Typography>
      <Typography className="text-black mt-2">
        {t("sectionDataCollectionText1")}
      </Typography>
      <ul className="list-disc list-inside text-black mt-2 space-y-1">
        <li>{t("dataItem1")}</li>
        <li>{t("dataItem2")}</li>
        <li>{t("dataItem3")}</li>
      </ul>
      <Typography className="text-black mt-2">
        {t("sectionDataProcessingText1")}
      </Typography>
      <ul className="list-disc list-inside text-black mt-2 space-y-1">
        <li>{t("purposeItem1")}</li>
        <li>{t("purposeItem2")}</li>
        <li>{t("purposeItem3")}</li>
        <li>{t("purposeItem4")}</li>
        <li>{t("purposeItem5")}</li>
      </ul>

      <Typography className="text-black mt-6">{t("sectionDataStorage")}</Typography>
      <Typography className="text-black mt-2">
        {t("sectionDataStorageText1")}
      </Typography>
      <Typography className="text-black mt-2">
      {t("sectionDataStorageText2")}
      </Typography>
      <Typography className="text-black mt-2">
      {t("sectionDataStorageText3")}
      </Typography>
      <Typography className="text-black mt-2">
      {t("sectionDataStorageText4")}
      </Typography>

      <Typography className="text-black mt-6">{t("sectionUserRights")}</Typography>
      <Typography className="text-black mt-2">
        {t("sectionUserRightsText1")}
      </Typography>
      <ul className="list-disc list-inside text-black mt-2 space-y-1">
        <li>{t("userRight1")}</li>
        <li>{t("userRight2")}</li>
        <li>{t("userRight3")}</li>
        <li>{t("userRight4")}</li>
      </ul>
      <Typography className="text-black mt-2">
        {t("sectionUserRightsText2")}
      </Typography>
      <Typography className="text-black mt-2">
      {t("sectionUserRightsText3")}
      </Typography>

      <Typography className="text-black mt-6">{t("sectionCookies")}</Typography>
      <Typography className="text-black mt-2">
        {t("sectionCookiesText1")}
      </Typography>
      <Typography className="text-black mt-2">
        {t("sectionCookiesText2")}
      </Typography>

      <Typography className="text-black mt-6">{t("sectionChanges")}</Typography>
      <Typography className="text-black mt-2">
        {t("sectionChangesText1")}
      </Typography>
      <Typography className="text-black mt-2">
        {t("sectionChangesText2")}
      </Typography>

      <Typography className="text-black mt-6">{t("sectionContacts")}</Typography>
      <Typography className="mt-2">{t("sectionContactsText1")}</Typography>
      <Typography className="text-black mt-2">
        Email: info@burabaydamu.kz
      </Typography>
      <Typography className="text-black mt-2">
        WhatsApp: 87010921405
      </Typography>
      <Typography className="text-black mt-2">
        {t("contactAddress")}
      </Typography>
      <Typography className="text-black mt-2">
        {t("contactPhoneDa")}
      </Typography>

      <Typography className="text-black mt-6">{t("sectionConsent")}</Typography>
      <Typography className="text-black mt-2">
        {t("sectionConsentText1")}
      </Typography>
    </div>

  </div>
  </main>
  )
};
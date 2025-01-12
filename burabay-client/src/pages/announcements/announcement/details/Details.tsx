import {
  Announcement,
  AnnouncementDetails,
} from "../../model/announcements";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { Typography } from "../../../../shared/ui/Typography";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import CheckMarkIcon from "../../../../app/icons/announcements/check-mark.svg";

interface Props {
  announcement: Announcement;
}

export const Details: FC<Props> = function Details({ announcement }) {
  const { t } = useTranslation();
  const [services, _] = useState<AnnouncementDetails>(
    announcement.details || {}
  );
  return (
    <section className="bg-background min-h-screen">
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
              {t("detailsTitle")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => history.back()}
          ></IconContainer>
        </div>
      </Header>

      <div className="bg-white m-4 rounded-lg">
        <ul>
          {Object.keys(services).map((service, index) => (
            <li
              key={index}
              className="flex justify-between p-3 h-16 items-center border-b border-gray-300"
            >
              <span>{t(`${service}`)}</span>
              <img src={CheckMarkIcon} alt={t(`${service}`)} className="w-6" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

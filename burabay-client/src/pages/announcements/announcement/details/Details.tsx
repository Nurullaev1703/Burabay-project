import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { Typography } from "../../../../shared/ui/Typography";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import CheckMarkIcon from "../../../../app/icons/announcements/check-mark.svg";
import { Announcement, AnnouncementDetails } from "../../model/announcements";

interface Props {
  announcement: Announcement;
}

export const Details: FC<Props> = function Details({ announcement }) {
  const { t } = useTranslation();
  const [services, _] = useState<AnnouncementDetails>(
    announcement.details || {}
  );

  useEffect(() => {
    const scrollableElement = document.querySelector(
      ".ios-scrollable-content"
    ) as HTMLElement;
    if (scrollableElement) {
      scrollableElement.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <section className="bg-background md:bg-transparent min-h-screen">
      <Header className="md:max-w-[1200px] md:mx-auto">
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

      <div className="bg-white m-4 rounded-lg md:max-w-[1200px] md:mx-auto">
        {Object.keys(services).length > 0 ? (
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
        ) : (
          <div className="flex items-center justify-center py-12">
            <Typography
              size={16}
              weight={400}
              color={COLORS_TEXT.gray100}
              align="center"
            >
              {t("noDetails")}
            </Typography>
          </div>
        )}
      </div>
    </section>
  );
};

import { FC } from "react";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { Typography } from "../../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";

interface Props {
  booking: any;
}

export const SelectedBooking: FC<Props> = function SelectedBooking({
  booking,
}) {
  console.log(booking);
  const { t } = useTranslation();
  return (
    <section>
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
              {t("booking")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("booking")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => history.back()}
          ></IconContainer>
        </div>
      </Header>
    </section>
  );
};

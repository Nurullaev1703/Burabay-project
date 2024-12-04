import { FC } from "react";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import BackIcon from "../../../app/icons/back-icon.svg";
import { useTranslation } from "react-i18next";
import { NotificationCard } from "./ui/NotificationCard";
import { Hint } from "../../../shared/ui/Hint";
import { NotificationType } from "./notification-utils";

interface Props {
  data: NotificationType[] | undefined;
}

export const Notifications: FC<Props> = function Notifications(props) {
  const { t } = useTranslation();
  return (
    <div className="px-4">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={800}>
            {t("notifications")}
          </Typography>
          <IconContainer align="center"></IconContainer>
        </div>
      </Header>
      <main className="my-18 flex flex-col gap-4">
        <ul>
          {props.data?.map((item) => {
            return <NotificationCard date={item.date} title={item.title} key={item.id}/>;
          })}
        </ul>
        {!Boolean(props.data?.length) && (
          <Hint title={t("noNotificaitions")} align="center" />
        )}
      </main>
    </div>
  );
};

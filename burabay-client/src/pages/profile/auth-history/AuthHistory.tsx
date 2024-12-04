import { FC } from "react";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import BackIcon from "../../../app/icons/back-icon.svg";
import { useTranslation } from "react-i18next";
import { Hint } from "../../../shared/ui/Hint";
import { AuthHistoryCard } from "./ui/AuthHistoryCard";
import { useAuth } from "../../../features/auth";

export const AuthHistory: FC = function AuthHistory() {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <div className="px-4">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={800}>
            {t("authHistory")}
          </Typography>
          <IconContainer align="center"></IconContainer>
        </div>
      </Header>
      <main className="my-18">
        <ul className="flex flex-col gap-6">
          {user?.authHistories?.map((item) => {
            return <AuthHistoryCard data={item} key={item.id} />;
          })}
          {!Boolean(user?.authHistories?.length) && (
            <Hint title={t("noAuthHistory")} />
          )}
        </ul>
      </main>
    </div>
  );
};

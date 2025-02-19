import { FC } from "react";
import { AdCard } from "../main/ui/AdCard";
import { Typography } from "../../shared/ui/Typography";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import { Announcement } from "../announcements/model/announcements";

interface Props {
  favoritesList: Announcement[];
}

export const Favorites: FC<Props> = function Favorites({ favoritesList }) {
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
              {"Сохранненое"}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => history.back()}
          ></IconContainer>
        </div>
      </Header>

      {favoritesList.length > 0 ? (
        <ul className="mt-2 grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-2 mb-navContent bg-white p-4">
          {favoritesList.map((item) => {
            return (
              <AdCard
                ad={item}
                key={item.id}
                width={favoritesList.length == 1 ? "w-[48%]" : ""}
              />
            );
          })}
        </ul>
      ) : (
        <div>
          <Typography color={COLORS_TEXT.white} align="center">
            {t("noAds")}
          </Typography>
        </div>
      )}
    </section>
  );
};

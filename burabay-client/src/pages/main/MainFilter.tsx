import { FC } from "react";
import { Header } from "../../components/Header";
import { MainPageFilter } from "./model/mainpage-types";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import { COLORS_TEXT } from "../../shared/ui/colors";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Switch } from "@mui/material";
import StarIcon from "../../app/icons/announcements/star.svg";
import { Button } from "../../shared/ui/Button";

interface Props {
  filters: MainPageFilter;
}

export const MainFilter: FC<Props> = ({ filters }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="bg-white min-h-screen">
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
              {t("Фильтр")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={async () =>
              navigate({
                to: "/main",
              })
            }
          >
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
      </Header>
      <div className="p-4">
        <div className="mb-4">
          <Typography
            size={14}
            weight={400}
            color={COLORS_TEXT.gray100}
            className="mb-2"
          >
            {"Цена"}
          </Typography>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="От"
              className="border-2 border-[#0A7D9E] px-5 py-4 rounded-full w-full outline-none"
              value={filters.minPrice ?? ""}
            />
            <input
              defaultValue=""
              type="number"
              placeholder="До"
              className="border-2 border-[#0A7D9E] px-5 py-4 rounded-full w-full outline-none"
              value={filters.maxPrice ?? ""}
            />
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div className="flex">
            <Typography size={16} weight={400}>{`С рейтингом выше`}</Typography>
            <img src={StarIcon} className="w-[16px] mr-1 ml-2" />
            <Typography
              size={16}
              weight={400}
            >{`${filters.isHighRating ?? "4.5"}`}</Typography>
          </div>
          <Switch />
        </div>

        <div className="mb-4">
          <Typography size={18} weight={500} className=" mb-2">
            {"Подкатегория"}
          </Typography>
          {filters.subcategories?.map((category, index) => (
          <label key={index} className="flex items-center space-x-2 mb-3">
          <input
            className="w-5 h-5 mr-[10px] rounded-lg border-2 border-[#DBDBDB] checked:border-[#0A7D9E] outline-none"
            type="checkbox"
          />
          <Typography size={16} weight={400}>
            {category}
          </Typography>
        </label>
          ))}
        </div>

        <div className="mb-4">
          <Typography size={18} weight={500} className=" mb-2">
            {"Подробности"}
          </Typography>
          {filters.details?.map((detail, index) => (
          <label key={index} className="flex items-center space-x-2 mb-3">
          <input
            className="w-5 h-5 mr-[10px] rounded-lg border-2 border-[#DBDBDB] checked:border-[#0A7D9E] outline-none"
            type="checkbox"
          />
          <Typography size={16} weight={400}>
            {detail}
          </Typography>
        </label>
          ))}
        </div>
        
        <div className="">
          <Button className="w-full  text-white p-3 rounded">
            {"Применить"}
          </Button>
          <Button mode="border" className="w-full p-3 mt-2">
            {"Сбросить все фильтры"}
          </Button>
        </div>
      </div>
    </div>
  );
};

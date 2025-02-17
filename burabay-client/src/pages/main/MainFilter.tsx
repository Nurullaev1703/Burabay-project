import { FC, useState } from "react";
import { Header } from "../../components/Header";
import { MainPageFilter } from "./model/mainpage-types";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import { COLORS_TEXT } from "../../shared/ui/colors";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Checkbox, Switch } from "@mui/material";
import StarIcon from "../../app/icons/announcements/star.svg";
import { Button } from "../../shared/ui/Button";
import { Category } from "../announcements/model/announcements";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  filters: MainPageFilter;
  category: Category;
}

export const MainFilter: FC<Props> = ({ filters, category }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<MainPageFilter>({
    ...filters,
    subcategories: filters.subcategories ? [...filters.subcategories] : [],
  });
  const applyFilters = () => {
    navigate({
      to: "/main",
      search: selectedFilters,
    });
  };
  const resetFilters = () => {
    setSelectedFilters({
      minPrice: undefined,
      maxPrice: undefined,
      isHighRating: undefined,
      subcategories: [],
      details: [],
      name: undefined,
    });
    navigate({
      to: "/main",
      search: {},
    });
  };
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
                search: {
                  adName: selectedFilters.name || "",
                  category: selectedFilters.category,
                }
              })
            }
          >
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
      </Header>
      <div className="p-4 mb-32">
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
              value={selectedFilters.minPrice ?? ""}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 9);
                  setSelectedFilters((prev) => ({
                    ...prev,
                    minPrice: value ? Number(value) : undefined,
                  }));
                }}
              />
            <input
              type="number"
              
              placeholder="До"
              className="border-2 border-[#0A7D9E] px-5 py-4 rounded-full w-full outline-none"
              value={selectedFilters.maxPrice ?? ""}
              onChange={(e) => {
                const value = e.target.value.slice(0, 9);
                setSelectedFilters((prev) => {
                  const maxPrice = Number(value);
                  return {
                    ...prev,
                    maxPrice: maxPrice,
                  };
                });
              }}
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
          <Switch
            checked={selectedFilters.isHighRating ?? false}
            onChange={() =>
              setSelectedFilters((prev) => ({
                ...prev,
                isHighRating: !prev.isHighRating,
              }))
            }
          />
        </div>

        <div className="mb-4">
          <Typography size={18} weight={500} className=" mb-2">
            {"Подкатегория"}
          </Typography>
          {category.subcategories?.map((subcategory, index) => (
            <label key={index} className="flex items-center space-x-2 mb-3">
              <Checkbox
                key={index}
                checked={
                  selectedFilters.subcategories?.includes(subcategory.name) ||
                  false
                }
                onChange={() => {
                  setSelectedFilters((prevFilters) => {
                    const updatedSubcategories =
                      prevFilters.subcategories?.includes(subcategory.name)
                        ? prevFilters.subcategories.filter(
                            (s) => s !== subcategory.name
                          )
                        : [
                            ...(prevFilters.subcategories || []),
                            subcategory.name,
                          ];

                    return {
                      ...prevFilters,
                      subcategories: updatedSubcategories,
                    };
                  });
                }}
                sx={{ p: 0 }}
                disableRipple
                icon={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: "1px solid #DBDBDB",
                    }}
                  />
                }
                checkedIcon={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      backgroundColor: "#0A7D9E",
                      border: "1px solid #0A7D9E",
                    }}
                  >
                    <CheckIcon
                      style={{
                        color: "white",
                        fontSize: "18px",
                        fontWeight: "200",
                      }}
                    />
                  </span>
                }
              />

              <Typography size={16} weight={400}>
                {subcategory.name}
              </Typography>
            </label>
          ))}
        </div>

        <div className="mb-4">
          <Typography size={18} weight={500} className=" mb-2">
            {"Подробности"}
          </Typography>
          {category.details?.map((detail, index) => (
            <label key={index} className="flex items-center space-x-2 mb-3">
              <Checkbox
                checked={selectedFilters.details?.includes(detail) || false}
                onChange={() => {
                  setSelectedFilters((prevFilters) => {
                    const updatedDetails = prevFilters.details?.includes(detail)
                      ? prevFilters.details.filter((d) => d !== detail)
                      : [...(prevFilters.details || []), detail];

                    return { ...prevFilters, details: updatedDetails };
                  });
                }}
                sx={{ p: 0 }}
                disableRipple
                icon={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: "1px solid #DBDBDB",
                    }}
                  />
                }
                checkedIcon={
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      backgroundColor: "#0A7D9E",
                      border: "1px solid #0A7D9E",
                    }}
                  >
                    <CheckIcon
                      style={{
                        color: "white",
                        fontSize: "18px",
                        fontWeight: "200",
                      }}
                    />
                  </span>
                }
              />
              <Typography size={16} weight={400}>
                {t(detail)}
              </Typography>
            </label>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white py-2 px-4 z-10">
        <Button
          className="w-full  text-white p-3 rounded"
          onClick={() => applyFilters()}
        >
          {"Применить"}
        </Button>
        <Button
          mode="border"
          className="w-full p-3 mt-2"
          onClick={resetFilters}
        >
          {"Сбросить все фильтры"}
        </Button>
      </div>
    </div>
  );
};

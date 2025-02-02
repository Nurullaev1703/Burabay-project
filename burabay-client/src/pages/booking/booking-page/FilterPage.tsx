import { FC, useState } from "react";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { roleService } from "../../../services/storage/Factory";

interface FilterType {
  onlinePayment: boolean;
  onSidePayment: boolean;
  canceled: boolean;
}

export const FilterPage: FC = function FilterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = roleService.getValue();
  // Извлекаем параметры фильтров из URL
  const queryParams = new URLSearchParams(location.search);

  const [filters, setFilters] = useState<FilterType>({
    onlinePayment: queryParams.get("onlinePayment") === "true",
    onSidePayment: queryParams.get("onSidePayment") === "true",
    canceled: queryParams.get("canceled") === "true",
  });

  const handleFilterChange = (filterName: keyof FilterType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  // Применяем фильтры и обновляем URL
  const applyFilters = () => {
    const searchParams = new URLSearchParams();

    if (filters.onlinePayment) searchParams.set("onlinePayment", "true");
    if (filters.onSidePayment) searchParams.set("onSidePayment", "true");
    if (filters.canceled) searchParams.set("canceled", "true");

    // Обновляем URL с новыми фильтрами
    navigate({
      to: `/booking/${userRole === "турист" ? "tourist" : "business"}?${searchParams.toString()}`,
    });
  };
  return (
    <section>
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={applyFilters}>
            <img src={BackIcon} alt="Back" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("filter")}
            </Typography>
          </div>
          <IconContainer align="end"></IconContainer>
        </div>
      </Header>

      <div className="px-4 flex flex-col">
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.onlinePayment}
              onChange={() => handleFilterChange("onlinePayment")}
            />
          }
          label={t("onlinePayment")}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={filters.onSidePayment}
              onChange={() => handleFilterChange("onSidePayment")}
            />
          }
          label={t("onSidePayment")}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={filters.canceled}
              onChange={() => handleFilterChange("canceled")}
            />
          }
          label={t("cancelled")}
        />
      </div>
    </section>
  );
};

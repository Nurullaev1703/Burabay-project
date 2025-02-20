import { FC, useState } from "react";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { roleService } from "../../../services/storage/Factory";
import { BookingPageFilter } from "../model/booking";

interface Props {
  filters: BookingPageFilter;
}

export const FilterPage: FC<Props> = function FilterPage({filters}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userRole = roleService.getValue();

  const [localFilters, setLocalFilters] = useState<BookingPageFilter>({
    onlinePayment: filters.onlinePayment ?? false,
    onSidePayment: filters.onSidePayment ?? false,
    canceled: filters.canceled ?? false,
  });

  const handleFilterChange = (filterName: keyof BookingPageFilter) => {
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  // Применяем фильтры и обновляем URL
  const applyFilters = () => {
    navigate({
      to: `/booking/${userRole === "турист" ? "tourist" : "business"}`,
      search: (prev) => ({
        ...prev,
        ...localFilters,
      }),
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
              checked={localFilters.onlinePayment}
              onChange={() => handleFilterChange("onlinePayment")}
            />
          }
          label={t("onlinePayment")}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.onSidePayment}
              onChange={() => handleFilterChange("onSidePayment")}
            />
          }
          label={t("onSidePayment")}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.canceled}
              onChange={() => handleFilterChange("canceled")}
            />
          }
          label={t("cancelled")}
        />
      </div>
    </section>
  );
};

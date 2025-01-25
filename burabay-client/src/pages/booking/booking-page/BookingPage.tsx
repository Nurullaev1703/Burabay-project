import { FC, useState } from "react";
import { NavMenuOrg } from "../../../shared/ui/NavMenuOrg";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "@tanstack/react-router";
import SearchIcon from "../../../app/icons/search-icon.svg";
import FilterIcon from "../../../app/icons/main/filter.svg";

export const BookingPage: FC = function BookingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState<string>("");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращаем стандартное поведение (если нужно)
      console.log(searchValue);
    }
  };
  return (
    <section>
      <div className="flex justify-between items-center text-center gap-3 px-4 bg-white">
        <div className="w-full flex mt-4 items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
          <img src={SearchIcon} alt="Поиск" />
          <input
            type="search"
            placeholder={t("search")}
            className="flex-grow bg-transparent outline-none text-gray-700"
            autoCorrect="true"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            // onBlur={() => {

            // }}
          />
        </div>
        <Link>
          <img src={FilterIcon} className="mt-4" alt="Фильтр" />
        </Link>
      </div>


      <NavMenuOrg />
    </section>
  );
};

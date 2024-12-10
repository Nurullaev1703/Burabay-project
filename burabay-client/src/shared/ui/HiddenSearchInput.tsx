import { Dispatch, FC, HTMLAttributes, SetStateAction } from "react";
import { COLORS } from "./colors";
import SearchIconInput from "../../app/icons/products/search-icon-input.svg";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { SORT_BY } from "../../pages/discount/ui/DiscountSortModal";
import { ProductRoutes } from "../context/SearchRoutes";
import { ProductFilter } from "../../pages/subcategory/subcategory-utils";

interface Props extends HTMLAttributes<HTMLInputElement> {
  handleSetIsSearch: (isSearch: boolean) => void;
  hint?: string;
  currentValue: string;
  setCurrentValue: Dispatch<SetStateAction<string>>;
  handleSearch?: (value: string) => void;
  navigateTo?: ProductRoutes
}
export const HiddenSearchInput: FC<Props> = function HiddenSearchInput(props) {
  // получаем доступ к текущему маршруту
  const navigate = useNavigate({ from: props.navigateTo || "/discount" });
  // получаем нынешние фильтры
  const matches = useMatches();
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Предотвращаем стандартное поведение (если нужно)
      performSearch(event.currentTarget.value);
    }
  };
  const performSearch = (value: string) => {
    const matchData = matches[matches.length - 1].search as ProductFilter;
    navigate({
      search: {
        brandName: matchData.brandName || [],
        name: value || "",
        sortBy: matchData.sortBy || SORT_BY.NEW,
      },
    });
  };
  return (
    <div className="w-0 relative flex justify-end transition-all">
      <img
        src={SearchIconInput}
        alt=""
        className={`absolute top-[50%] left-3 translate-y-[-50%]`}
      />
      <input
        autoFocus
        type="search"
        autoCorrect="on"
        value={props.currentValue}
        placeholder={props.hint || "Найти товар в категории"}
        onChange={(e) => props.setCurrentValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`border border-gray300 rounded-[36px] w-full
               py-2 pr-3 pl-10 outline-none focus:caret-main200 transition-all`}
        style={{
          background: `${COLORS.light200}`,
        }}
        onBlur={(field) => {
          if (field.target.parentElement) {
            field.target.parentElement.style.width = "30px";
            field.target.style.border = "none";
            field.target.style.width = "0";
            field.target.style.background = "transparent";
            setTimeout(() => {
              props.handleSetIsSearch(false);
            }, 150);
            performSearch(field.target.value)
          }
        }}
        onFocus={(field) => {
          if (field.target.parentElement)
            field.target.parentElement.style.width = "100%";
        }}
      />
    </div>
  );
};

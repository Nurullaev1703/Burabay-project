import { Dispatch, FC, HTMLAttributes, SetStateAction } from "react";
import SearchIconInput from "../../app/icons/products/search-icon-input.svg";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { ProductFilter } from "../../pages/subcategory/subcategory-utils";
import { SORT_BY } from "../../pages/subcategory/ui/SortModal";
import { ProductRoutes } from "../context/SearchRoutes";

interface Props extends HTMLAttributes<HTMLInputElement> {
  hint?: string;
  currentValue: string;
  setCurrentValue: Dispatch<SetStateAction<string>>;
  handleSearch?: (value: string) => void;
  navigateTo?: ProductRoutes;
}
export const SearchInput: FC<Props> = function SearchInput(props) {
  // получаем доступ к текущему маршруту
  const navigate = useNavigate({
    from: props.navigateTo || "/subcategories/$subcategoryId",
  });
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
    if (props.navigateTo) {
      navigate({
        to: props.navigateTo,
        search: {
          brandName: matchData.brandName || [],
          name: value || "",
          sortBy: matchData.sortBy || SORT_BY.NEW,
        },
      });
    } else {
      navigate({
        search: {
          brandName: matchData.brandName || [],
          name: value || "",
          sortBy: matchData.sortBy || SORT_BY.NEW,
        },
      });
    }
  };
  return (
    <div className={`w-full relative ${props.className}`}>
      <img
        src={SearchIconInput}
        alt=""
        className={`absolute top-[50%] left-3 translate-y-[-50%]`}
      />
      <input
        type="search"
        autoCorrect="on"
        value={props.currentValue}
        placeholder={props.hint || "Найти товар в категории"}
        onChange={(e) => props.setCurrentValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`border border-gray300 rounded-[36px] w-full bg-gray200
               py-2 pr-3 pl-10 outline-none focus:caret-main200 transition-all`}
      />
    </div>
  );
};

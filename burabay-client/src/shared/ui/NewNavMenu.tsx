import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { ProductBack } from "../../app/icons/nav-menu/ProductBack";
import { Orders } from "../../app/icons/nav-menu/Orders";
import { COLORS_BACKGROUND, COLORS_TEXT } from "./colors";
import { Profile } from "../../app/icons/nav-menu/Profile";
import { roleService } from "../../services/storage/Factory";
import { useTranslation } from "react-i18next";
import { Main } from "../../app/icons/nav-menu/Main";
import { Providers } from "../../app/icons/nav-menu/Providers";
import { Cart } from "../../app/icons/nav-menu/Cart";

export const NewNavMenu: FC = function NewNavMenu() {
  const role = roleService.getValue();
  const { t } = useTranslation();
  return (
    <>
      <nav
        className={`fixed bottom-0 left-0 z-50 pb-[8px] pt-[5px] w-full flex justify-center ${COLORS_BACKGROUND.alternative}`}
      >
        {(role === t("noneRole") || role === t("buyerRole")) && (
          <ul className={"flex justify-between"}>
            <li className="w-[68px]">
              <Link
                to="/main"
                className="flex justify-center items-center flex-col"
              >
                <Main
                  strokeColor={
                    location.pathname.includes("main") ? "#FF891C" : "#939393"
                  }
                />
                <span
                  className={`${location.pathname.includes("main") ? COLORS_TEXT.main200 : COLORS_TEXT.context100} text-[10px]`}
                >
                  {t("main")}
                </span>
              </Link>
            </li>
            <li className="w-[68px]">
              <Link
                to="/categories"
                className="flex justify-center items-center flex-col"
              >
                <Providers
                  strokeColor={
                    location.pathname.includes("categories")
                      ? "#FF891C"
                      : "#939393"
                  }
                />
                <span
                  className={`${location.pathname.includes("categories") ? COLORS_TEXT.main200 : COLORS_TEXT.context100} text-[10px]`}
                >
                  {"Категории"}
                </span>
              </Link>
            </li>
            {/* <li className="w-[68px]">
              <Link
                to="/providers"
                className="flex justify-center items-center flex-col"
              >
                <Providers
                  strokeColor={
                    location.pathname.includes("providers")
                      ? "#FF891C"
                      : "#939393"
                  }
                />
                <span
                  className={`${location.pathname.includes("providers") ? COLORS_TEXT.main200 : COLORS_TEXT.context100} text-[10px]`}
                >
                  {t("providers")}
                </span>
              </Link>
            </li> */}
            <li className="w-[68px]">
              <Link
                to="/cart"
                className="flex justify-center items-center flex-col"
              >
                <Cart
                  strokeColor={
                    location.pathname.includes("cart") ? "#FF891C" : "#939393"
                  }
                />
                <span
                  className={`${location.pathname.includes("cart") ? COLORS_TEXT.main200 : COLORS_TEXT.context100} text-[10px]`}
                >
                  {t("cart")}
                </span>
              </Link>
            </li>
            <li className="w-[68px]">
              <Link
                to="/delivered"
                className="flex justify-center items-center flex-col"
              >
                <Orders
                  strokeColor={
                    location.pathname.includes("delivered")
                      ? "#FF891C"
                      : "#939393"
                  }
                />
                <span
                  className={`${location.pathname.includes("delivered") ? COLORS_TEXT.main200 : COLORS_TEXT.context100} text-[10px]`}
                >
                  {t("orders")}
                </span>
              </Link>
            </li>
            <li className="w-[68px]">
              <Link
                to="/profile"
                className="flex justify-center items-center flex-col"
              >
                <Profile
                  strokeColor={
                    location.pathname.includes("profile")
                      ? "#FF891C"
                      : "#939393"
                  }
                />
                <span
                  className={`${location.pathname.includes("profile") ? COLORS_TEXT.main200 : COLORS_TEXT.context100} text-[10px]`}
                >
                  {t("profile")}
                </span>
              </Link>
            </li>
          </ul>
        )}

        {role === t("providerRole") && (
          <ul className={"flex justify-between"}>
            <li className="w-[114px]">
              <Link
                to="/full-products"
                className="flex justify-center items-center flex-col"
              >
                <ProductBack
                  strokeColor={
                    location.pathname.includes("full-products") ||
                    location.pathname.includes("products") ||
                    location.pathname.includes("promo") ||
                    location.pathname.includes("discount") ||
                    location.pathname.includes("subcategories")
                      ? "#FF891C"
                      : "#939393"
                  }
                />
                <span
                  className={`${location.pathname.includes("full-products") || location.pathname.includes("products") || location.pathname.includes("promo") || location.pathname.includes("discount") || location.pathname.includes("subcategories") 
                    ? COLORS_TEXT.main200 : 
                    COLORS_TEXT.context100} text-[10px]`}
                >
                  {"Товарный портфель"}
                </span>
              </Link>
            </li>
            <li className="w-[114px]">
              <Link
                to="/orders"
                className="flex justify-center items-center flex-col"
              >
                <Orders
                  strokeColor={
                    location.pathname.includes("orders") ? "#FF891C" : "#939393"
                  }
                />
                <span
                  className={`${location.pathname.includes("orders") ? COLORS_TEXT.main200 : COLORS_TEXT.context100} text-[10px]`}
                >
                  {"Заказы"}
                </span>
              </Link>
            </li>
            <li className="w-[114px]">
              <Link
                to="/profile"
                className="flex justify-center items-center flex-col"
              >
                <Profile
                  strokeColor={
                    location.pathname === "/" ||
                    location.pathname.includes("profile")
                      ? "#FF891C"
                      : "#939393"
                  }
                />
                <span
                  className={`${location.pathname === "/" || location.pathname.includes("profile") ? COLORS_TEXT.main200 : COLORS_TEXT.context100} text-[10px]`}
                >
                  {"Профиль"}
                </span>
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
};

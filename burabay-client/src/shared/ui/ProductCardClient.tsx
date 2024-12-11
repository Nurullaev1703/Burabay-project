import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import defaultImage from "../../app/img/default-image.png";
import { Typography } from "./Typography";
import { COLORS_TEXT } from "./colors";
import { baseUrl } from "../../services/api/ServerData";
import { Link } from "@tanstack/react-router";
import { PROD_STATUS } from "../../pages/subcategory/types/subcategory-types";
import { Product } from "../../pages/subcategory/types/subcategory-types";
import CartIcon from "../../app/icons/products/cart.svg";
import { IconContainer } from "./IconContainer";
import { TextField } from "@mui/material";
import MinusIcon from "../../app/icons/minus.svg";
import PlusIcon from "../../app/icons/plus.svg";
import { CartItem } from "../../pages/cart/model/cart";
import { Filial } from "../../pages/products/edit/types/edit-products";
import ProviderImage from "../../app/img/provider.png";

interface Props {
  product: Product;
  isBlockView?: boolean;
  providerInfo?: Filial;
  selectedItems: CartItem[];
  setSelectedItems: Dispatch<SetStateAction<CartItem[]>>;
}
export const ProductCardClient: FC<Props> = function ProductCardClient({
  product,
  isBlockView,
  selectedItems,
  setSelectedItems,
  providerInfo,
}) {
  const [imgSrc, setImgSrc] = useState<string>(baseUrl + product.images[0]);
  const [providerImg, setProviderImg] = useState<string>(
    baseUrl + product?.providerFilial?.organization?.imgUrl || ""
  );
  const minProductCount = product.minSum
    ? Math.ceil(product.minSum / (product.finalPrice || product.price || 1))
    : product.multiplicity;
  const [currentProductCount, setCurrentProductCount] = useState<number>(0);
  const handleAddProduct = () => {
    setCurrentProductCount((value) => value + product.multiplicity);
  };
  const handleSubstractProduct = () => {
    if (currentProductCount >= minProductCount) {
      setCurrentProductCount((value) => value - product.multiplicity);
    }
    if (currentProductCount <= minProductCount) {
      setCurrentProductCount(0);
    }
  };
  const handleChangeProductCount = () => {
    if (currentProductCount >= minProductCount) {
      setSelectedItems((values) => [
        ...values.filter((item) => item.productId !== product.id),
        {
          productId: product.id,
          count: currentProductCount,
        },
      ]);
    } else {
      setSelectedItems(
        selectedItems.filter((item) => item.productId != product.id)
      );
    }
  };
  useEffect(() => {
    handleChangeProductCount();
  }, [currentProductCount]);
  return (
    <li
      id={`card${product.id}`}
      className={`rounded-[12px] bg-alternate p-2 relative overflow-hidden cursor-pointer ${isBlockView ? "w-full" : "w-[48%]"}`}
    >
      <div className={isBlockView ? "flex gap-2" : ""}>
        {/* Отображение акции */}
        {product.status === PROD_STATUS.PROMO && (
          <div
            className={
              "absolute z-10 top-1 right-[-17px] py-1 bg-main200 w-[90px] rotate-[30deg]"
            }
          >
            <Typography size={12} color={COLORS_TEXT.white} align="center">
              {`Акция`}
            </Typography>
          </div>
        )}
        <Link
          to="/product/client/$productId"
          params={{ productId: product.id }}
        >
          <div
            className={`cover relative ${isBlockView ? "w-[110px] h-[110px]" : "w-full pt-[100%]"}`}
          >
            <img
              src={imgSrc}
              onError={() => setImgSrc(defaultImage)}
              className="absolute top-0 left-0 object-cover w-full h-full rounded-[4px]"
            />
            {providerInfo?.organization ? (
              <div className="w-10 h-10 absolute top-0 left-0 bg-alternate z-10 rounded-br-lg">
                <img
                  src={providerImg}
                  alt=""
                  className="w-full h-full object-cover scale-[0.9]"
                  onError={() => setProviderImg(ProviderImage)}
                />
              </div>
            ) : (
              <></>
            )}
            {(product.status === PROD_STATUS.SALE || product.sale > 0) && (
              <div className="absolute bottom-2 left-[-8px] bg-main200 rounded-r-[10px] px-[7px] py-[2px]">
                <Typography size={12} color={COLORS_TEXT.white} weight={700}>
                  {`-${product.sale}%`}
                </Typography>
              </div>
            )}
          </div>
        </Link>

        <div
          id="card-content"
          className={`${isBlockView ? "w-list flex flex-col justify-between" : "mt-2 "}`}
        >
          <div
            className={
              isBlockView ? "flex flex-col-reverse gap-2 mb-2" : `flex flex-col`
            }
          >
            <div>
              {product.status === PROD_STATUS.SALE || product.sale > 0 ? (
                <div className="flex gap-1 items-baseline">
                  <Typography
                    size={18}
                    weight={600}
                    color={COLORS_TEXT.blue200}
                  >
                    {product.finalPrice + "₸" || "цена"}
                  </Typography>
                  <Typography
                    size={12}
                    weight={500}
                    color={COLORS_TEXT.secondary}
                    className="line-through"
                  >
                    {product.price + "₸"}
                  </Typography>
                </div>
              ) : (
                <Typography size={18} weight={600}>
                  {product.price + "₸"}
                </Typography>
              )}
              {product.multiplicity && product.minSum && (
                <Typography size={12} color={COLORS_TEXT.secondary}>
                  {/* Кратность товара в подкатегории и самого товара могут различаться */}
                  {`${product.multiplicity} ${product.unit} по ${Math.round(product.finalPrice / product.multiplicity)}₸`}
                </Typography>
              )}
            </div>
            <Typography
              id="product-name"
              size={12}
              className={`leading-none ${isBlockView ? "line-clamp-2 w-[80%]" : "h-[38px] line-clamp-3 mt-2"}  overflow-hidden`}
            >
              {product.name}
            </Typography>
          </div>
          {/* Стили для отображения в виде списка */}
          {isBlockView && (
            <div className={"flex justify-between items-center"}>
              {currentProductCount < minProductCount ? (
                <>
                  {product.minSum ? (
                    <div>
                      <Typography size={12} color={COLORS_TEXT.secondary}>
                        {"Заказ от:"}
                      </Typography>
                      <Typography
                        size={12}
                        color={COLORS_TEXT.blue200}
                      >{`${Math.ceil(product.minSum / (product.finalPrice || product.price || 1))} ${product.unit} за ${product.minSum}₸`}</Typography>
                    </div>
                  ) : (
                    <div>
                      <Typography size={12} color={COLORS_TEXT.secondary}>
                        {"Заказ от:"}
                      </Typography>
                      <Typography
                        size={12}
                        color={COLORS_TEXT.blue200}
                      >{`${product.multiplicity} ${product.unit} за ${product.finalPrice || product.price}₸`}</Typography>
                    </div>
                  )}
                  <IconContainer
                    align="end"
                    action={() => setCurrentProductCount(minProductCount)}
                  >
                    <img src={CartIcon} alt="" />
                  </IconContainer>
                </>
              ) : (
                <div className="flex items-center justify-end pt-2 w-full">
                  <IconContainer
                    align="center"
                    action={() => {
                      handleSubstractProduct();
                    }}
                  >
                    <img src={MinusIcon} alt="" />
                  </IconContainer>
                  <TextField
                    variant="standard"
                    type="number"
                    sx={{
                      width: "72px",
                      "& .MuiInputBase-input": {
                        fontWeight: 500,
                        textAlign: "center",
                      },
                    }}
                    value={currentProductCount}
                  />
                  <IconContainer
                    align="center"
                    action={() => {
                      handleAddProduct();
                    }}
                  >
                    <img src={PlusIcon} alt="" />
                  </IconContainer>
                </div>
              )}
            </div>
          )}
          {/* Стили для вертикального отображения */}
          {!isBlockView && (
            <>
              {product.minSum ? (
                <div>
                  <Typography size={12} color={COLORS_TEXT.secondary}>
                    {"Заказ от:"}
                  </Typography>
                  <Typography
                    size={12}
                    color={COLORS_TEXT.blue200}
                  >{`${Math.ceil(product.minSum / (product.finalPrice || product.price || 1))} ${product.unit} за ${product.minSum}₸`}</Typography>
                </div>
              ) : (
                <div>
                  <Typography size={12} color={COLORS_TEXT.secondary}>
                    {"Заказ от:"}
                  </Typography>
                  <Typography
                    size={12}
                    color={COLORS_TEXT.blue200}
                  >{`${product.multiplicity} ${product.unit} за ${product.finalPrice || product.price}`}</Typography>
                </div>
              )}
            </>
          )}
        </div>
        {!isBlockView && currentProductCount < minProductCount && (
          <button
            className={`rounded-[8px] py-2 w-full bg-main200 transition-all font-semibold text-alternate mt-2`}
            onClick={() => setCurrentProductCount(minProductCount)}
          >
            {"В корзину"}
          </button>
        )}
        {!isBlockView && currentProductCount >= minProductCount && (
          <div className="flex items-center justify-between pt-1">
            <IconContainer
              align="center"
              action={() => {
                handleSubstractProduct();
              }}
            >
              <img src={MinusIcon} alt="" />
            </IconContainer>
            <TextField
              variant="standard"
              type="number"
              sx={{
                width: "72px",
                "& .MuiInputBase-input": {
                  fontWeight: 500,
                  textAlign: "center",
                },
              }}
              value={currentProductCount}
            />
            <IconContainer
              align="center"
              action={() => {
                handleAddProduct();
              }}
            >
              <img src={PlusIcon} alt="" />
            </IconContainer>
          </div>
        )}
      </div>
    </li>
  );
};

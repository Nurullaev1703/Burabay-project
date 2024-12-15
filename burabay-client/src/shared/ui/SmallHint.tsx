import { FC } from "react";
import { Typography } from "./Typography";
import { COLORS_TEXT } from "./colors";
import { useTranslation } from "react-i18next";

interface Props {
    text?: string
}

export const SmallHint: FC<Props> = function SmallHint({text}) {
    const { t } = useTranslation()
  return (
    <div className="relative w-full h-4 my-4 flex items-center">
      <div className="w-full h-[1px] bg-gray100"></div>
      <Typography
        size={12}
        color={COLORS_TEXT.gray100}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-almostWhite px-4"
      >
        {text || t("signinWith")}
      </Typography>
    </div>
  );
};

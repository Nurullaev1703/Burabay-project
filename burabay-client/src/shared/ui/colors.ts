// перечисление цветовых решений приложения
// названия цветов можно менять в tailwind.config
export const COLORS_TEXT = {
  background: "text-background", // #F1F2F5
  access: "text-access", // #04C900

  blue100: "text-blue100", // #035F7C
  blue200: "text-blue200", //#0A7D9E
  blue300: "text-blue300", //#228AA8
  red: "text-red", //#FF4545
  almostWhite: "text-almostWhite", // #F1F2F6
  angularWhiteBlue: "text-angularWhiteBlue",
  totalBlack: "text-totalBlack", // #000000
  gray100: "text-gray100", // #999999
  gray200: "text-gray200", //#DBDBDB
  gray300: "text-gray300", // #E4E9EA
  white: "text-white", // #FFFFFF
};
export const COLORS_BACKGROUND = {
  blue100: "bg-blue100", // #035F7C
  blue200: "bg-blue200", //#0A7D9E
  blue300: "bg-blue300", //#228AA8
  red: "bg-red", //#FF4545
  almostWhite: "bg-almostWhite", // #F1F2F6
  angularWhiteBlue: "bg-angularWhiteBlue",
  totalBlack: "bg-totalBlack", // #000000
  gray100: "bg-gray100", // #999999
  gray200: "bg-gray200", //#DBDBDB
  gray300: "bg-gray300", // #E4E9EA
  white: "bg-white", // #FFFFFF
};
export const COLORS_BORDER = {
  blue100: "border-blue100", // #035F7C
  blue200: "border-blue200", //#0A7D9E
  blue300: "border-blue300", //#228AA8
  red: "border-red", //#FF4545
  almostWhite: "border-almostWhite", // #F1F2F6
  angularWhiteBlue: "border-angularWhiteBlue",
  totalBlack: "border-totalBlack", // #000000
  gray100: "border-gray100", // #999999
  gray200: "border-gray200", //#DBDBDB
  gray300: "border-gray300", // #E4E9EA
  white: "border-white", // #FFFFFF
};

export const COLORS = {
  blue100: "#035F7C",
  blue200: "#0A7D9E",
  blue300: "#228AA8",
  red: "#FF4545",
  almostWhite: "#F1F2F6",
  totalBlack: "#000000",
  gray100: "#999999",
  gray200: "#DBDBDB",
  gray300: "#E4E9EA",
  white: "#FFFFFF",
  angularWhiteBlue: "linear-gradient(135deg, #FFFFFF 0%, #228AA8 100%)",
  sunset: "linear-gradient(90deg, #FF7B1C 0%, #FF891C 50%, #FF9737 100%)",
  softGray: "linear-gradient(180deg, #EDECEA 0%, #FAF9F7 100%)",
};
export const categoryBgColors: Record<string, string> = {
  Отдых: "bg-[#39B598]",
  Жилье: "bg-[#5EBAE1]",
  Здоровье: "bg-[#DC53AD]",
  Экстрим: "bg-[#EF5C7F]",
  Достопримечательности: "bg-[#B49081]",
  Питание: "bg-[#F4A261]",
  Развлечения: "bg-[#E5C82F]",
  Прокат: "bg-[#A16ACD]",
  Безопасность: "bg-[#777CEF]",
};
export const categoryColors: Record<string, string> = {
  Отдых: "#39B598",
  Жилье: "#5EBAE1",
  Здоровье: "#DC53AD",
  Экстрим: "#EF5C7F",
  Достопримечательности: "#B49081",
  Питание: "#F4A261",
  Развлечения: "#E5C82F",
  Прокат: "#A16ACD",
  Безопасность: "#777CEF",
};

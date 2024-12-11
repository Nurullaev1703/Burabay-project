

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // добавление собственных именований классов в приложении
    extend: {
      colors: {
        error: "#FF4242",
        background: "#F1F2F5",
        access: "#04C900",
        blue100:  "#035F7C",
        blue200:  "#0A7D9E",
        blue300:  "#228AA8",
        red: "#FF4545",
        almostWhite: "#F1F2F6",
        totalBlack: "#000000",
        gray100: "#999999",
        gray200: "#DBDBDB",
        gray300: "#E4E9EA",
        white: "#FFFFFF",

        backgroundImage: {
          angularWhiteBlue: "linear-gradient(135deg, #FFFFFF 0%, #228AA8 100%)",
          sunset: "linear-gradient(90deg, #FF7B1C 0%, #FF891C 50%, #FF9737 100%)",
          softGray: "linear-gradient(180deg, #EDECEA 0%, #FAF9F7 100%)",
        }
      },

      background:{
        header: "url('../app/icons/backgroundHeader.png')"
      },
      width:{
        fullWidth: "800px"
      },
      maxWidth:{
        fullWidth: "800px"
      },
      minWidth:{
        fullWidth: "800px"
      },

      borderRadius: {
        tabs: "58px",
        "tab-item": "65px",
        button: "32px",
      },
      aspectRatio: {
        "3/4": "3 / 4",
      },
      margin: {
        18: "72px",
      },
      height:{
        "view": "calc(100vh - 88px)"
      },
      width:{
        "header": "calc(100% - 32px)",
        "list": "calc(100% - 108px)"
      }
    },
    fontFamily: {
      sans: ['"Roboto"', "sans-serif"],
    },
  },
  plugins: [],
};

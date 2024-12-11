import { createTheme } from "@mui/material/styles";
import { COLORS } from "./colors";
import { colors } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0A7D9E",
    },
  },
  typography: {
    fontFamily: "Roboto",
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "0",
          border: "none",
          background: "white",
          fontSize: "16px",
          caretColor: COLORS.blue200,
          lineHeight: "16px",
          ".css-14lo706": {
            display: "none",
            visibility: "visible", // Отображение placeholder
          },
          // FIXME при наличии подсказки и ошибки, border уезжает вниз
          // отключаем обводку поля
          /*"&.Mui-focused:placeholder-shown .MuiOutlinedInput-notchedOutline": {
            top: "0",
          },
          "&:not(.Mui-focused) .MuiOutlinedInput-notchedOutline":
            {
              top: "-5px",
            },
          "&.Mui-focused:not(:placeholder-shown) .MuiOutlinedInput-notchedOutline":
            {
              top: "0",
            },
          "&:not(.Mui-focused):not(:placeholder-shown) .MuiOutlinedInput-notchedOutline":
            {
              top: "-5px",
            },*/
          ".MuiOutlinedInput-notchedOutline": {
            display: "none",
          },
          "&:hover .css-14lo706, &:focus-within .css-14lo706": {
            opacity: 1, // Полное отображение при фокусе или наведении
          },
          "::placeholder": {
            visibility: "visible",
          },
          // стиль для настоящего поля ввода
          ".css-24rejj-MuiInputBase-input-MuiOutlinedInput-input": {
            paddingTop: "36px",
          },
          // стилизация ошибки
          "&.Mui-error": {
            background: "white",
            caretColor: COLORS.red,
            height: "100%",
            ".MuiOutlinedInput-notchedOutline": {
              display: "block",
              borderColor: COLORS.red,
              borderWidth: "1px",
              top: "0",
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          height: "100%",
          borderRadius: "8px",
          outline: "none",
          border: "none",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          caretColor: "#FF891C",
          padding: "0",
          height: "fit-content",
          "&::before": {
            borderBottom: "1px solid #edecea",
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "2px solid #FF7B1C",
          },
          "&.Mui-focused:after": {
            borderBottom: "2px solid #FF7B1C",
          },
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          position: "absolute",
          top: "12px",
          left: "12px",
          transform: "none",
          visibility: "visible",
          color: COLORS.gray100,
          fontSize: "12px",
          fontWeight: 400,
          "&.Mui-error": {
            color: COLORS.gray100,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase": {
            color: COLORS.softGray,
          },
          "& .MuiSwitch-track": {
            backgroundColor: COLORS.gray100,
          },
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: COLORS.blue200,
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: COLORS.gray200,
            opacity: 1,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        listbox: {
          padding: 0,
          border: `1px solid ${COLORS.gray100}`,
          boxShadow: "none",
          marginTop: "4px",
          borderRadius: "4px",
          outline: "none",
          height: "190px",
          "&::-webkit-scrollbar": {
            width: "5px",
            backgroundColor: COLORS.softGray,
            margin: "5px 0",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#BCBCBC",
            borderRadius: "23px",
          },
          ".MuiAutocomplete-option": {
            padding: "8px",
          },
          ".MuiAutocomplete-option:not(:hover).Mui-focused": {
            backgroundColor: COLORS.softGray,
          },
        },
        inputRoot: {
          paddingRight: 0,
        },
        root: {
          height: "32px",
          ".MuiInput-root .MuiInput-input": {
            padding: "4px 0",
            textOverflow: "inherit",
          },
          ".css-1glvl0p-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-clearIndicator":
            {
              display: "none",
            },
          ".MuiInputBase-root.MuiInput-root.MuiInput-underline.MuiInputBase-colorPrimary.MuiInputBase-fullWidth.MuiInputBase-formControl.MuiInputBase-adornedEnd.MuiAutocomplete-inputRoot.css-jk6q6j-MuiInputBase-root-MuiInput-root":
            {
              paddingRight: 0,
            },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginTop: "8px",
          color: COLORS.red,
          border: "none",
        },
      },
    },
  },
});

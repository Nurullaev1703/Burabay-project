import { createTheme } from "@mui/material/styles";
import { COLORS } from "./colors";

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
          ".MuiOutlinedInput-notchedOutline": {
            display: "none",
            borderColor: "transparent",
            transition: "border-color 0.3s, top 0.3s",
            width: "100%",
            top: "0", // Оставить фиксированную позицию
          },
          // убирает верхнюю подсказку
          ".css-14lo706>span, .css-yjsfm1>span": {
            display: "none",
          },
          // // убирает верхнюю подсказку
          "legend": {
            display: "none",
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            display: "block",
            borderColor: COLORS.red,
            transform: "none",
            borderWidth: "1px", // Убедитесь, что толщина границы не меняется
          },
          "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
            display: "block",
            borderColor: COLORS.red,
            transform: "none",
          },
          ".css-24rejj-MuiInputBase-input-MuiOutlinedInput-input": {},
          ".MuiInputBase-input-MuiOutlinedInput-input": {
            paddingTop: "36px",
          },
          ".css-1pog434": {
            paddingTop: "36px",
          },
          textarea: {
            padding: "16.5px 14px",
            paddingTop: "44px",
            lineHeight: "20px",
          },
        },
        input: {
          paddingTop: "36px",
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
          caretColor: "#0A7D9E",
          padding: "0",
          height: "fit-content",
          "&::before": {
            borderBottom: "1px solid #edecea",
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "2px solid #0A7D9E",
          },
          "&.Mui-focused:after": {
            borderBottom: "2px solid #0A7D9EC",
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
            color: COLORS.gray100,
          },
          "& .MuiSwitch-track": {
            backgroundColor: COLORS.gray300,
          },
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: COLORS.blue200,
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: COLORS.gray300,
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
        },
      },
    },
  },
});

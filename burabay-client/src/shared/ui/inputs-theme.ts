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
          paddingTop: "20px",
          border: "none",
          background: "white",
          caretColor: "#0A7D9E",
          ".css-14lo706": {
            display: "none",
            visibility: "visible", // Отображение placeholder
          },
          ".MuiOutlinedInput-notchedOutline": {
            display: "none",
          },
          "&:hover .css-14lo706, &:focus-within .css-14lo706": {
            opacity: 1, // Полное отображение при фокусе или наведении
          },
          "::placeholder": {
            visibility: "visible",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
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
          color: COLORS.gray100,
          fontSize: "12px",
          fontWeight: 400
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
  },
});

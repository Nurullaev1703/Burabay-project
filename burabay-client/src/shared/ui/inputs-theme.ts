import { createTheme } from "@mui/material/styles";
import { COLORS } from "./colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FF891C",
    },
  },
  typography:{
    fontFamily: "SF Pro Text"
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
          outline: "none",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          caretColor: "#FF891C",
          padding: "0",
          height: "fit-content",
          "&::before":{
            borderBottom: "1px solid #edecea"
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
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase":{
            color: COLORS.secondary
          },
          "& .MuiSwitch-track":{
            backgroundColor: COLORS.disabled
          },
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: COLORS.main200,
          },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: COLORS.accent200,
            opacity: 1
          },
        },
      },
    },
    MuiAutocomplete:{
      styleOverrides:{
        listbox:{
          padding: 0,
          border: `1px solid ${COLORS.light100}`,
          boxShadow: "none",
          marginTop: "4px",
          borderRadius: "4px",
          outline: "none",
          height: "190px",
          "&::-webkit-scrollbar":{
            width: "5px",
            backgroundColor: COLORS.background,
            margin: "5px 0",
          },
          "&::-webkit-scrollbar-thumb":{
            backgroundColor: '#BCBCBC',
            borderRadius: "23px"
          },
          ".MuiAutocomplete-option":{
            padding: "8px"
          },
          ".MuiAutocomplete-option:not(:hover).Mui-focused":{
            backgroundColor: COLORS.accent200
          }
        },
        inputRoot:{
          paddingRight: 0
        },
        root:{
          height: "32px",
          ".MuiInput-root .MuiInput-input":{
            padding: "4px 0",
            textOverflow: "inherit"
          },
          ".css-1glvl0p-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-clearIndicator":{
            display: "none"
          },
          ".MuiInputBase-root.MuiInput-root.MuiInput-underline.MuiInputBase-colorPrimary.MuiInputBase-fullWidth.MuiInputBase-formControl.MuiInputBase-adornedEnd.MuiAutocomplete-inputRoot.css-jk6q6j-MuiInputBase-root-MuiInput-root":{
            paddingRight: 0
          }
        }
      }
    },   
  },
});

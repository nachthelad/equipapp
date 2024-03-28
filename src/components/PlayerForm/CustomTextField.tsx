import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { InputBaseComponentProps, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMediaQuery, useTheme } from "@mui/material";

const CustomTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: "100%",
  backgroundColor: "transparent",
  borderColor: "white",
  color: "white",
  padding: "18.5px 14px",
  fontSize: "1rem",
  fontFamily: theme.typography.fontFamily,
  borderRadius: 4,
  outline: "none",
  resize: "none",
  transition: theme.transitions.create(["border-color", "box-shadow"]),
  "&:focus": {
    boxShadow: `${theme.palette.primary.main} 0 0 0 2px`,
    borderColor: theme.palette.primary.main,
  },
}));

const CustomTextField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <TextField
      InputProps={{
        inputComponent:
          CustomTextarea as React.ElementType<InputBaseComponentProps>,
        inputProps: {
          minRows: 3,
          style: { color: "#fff", height: "auto" },
        },
      }}
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label="Ingresá los nombres línea por línea"
      InputLabelProps={{
        style: { color: "#fff" },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "white",
          },
          "&:hover fieldset": {
            borderColor: "white",
          },
          "&.Mui-focused fieldset": {
            borderColor: "white",
          },
        },
        maxWidth: "100%",
        width: isMobile ? "90vw" : "30vw",
      }}
    />
  );
};

export default CustomTextField;

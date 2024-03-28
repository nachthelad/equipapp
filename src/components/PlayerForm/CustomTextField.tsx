import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { InputBaseComponentProps, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

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
  return (
    <TextField
      InputProps={{
        inputComponent:
          CustomTextarea as React.ElementType<InputBaseComponentProps>,
        inputProps: {
          minRows: 3,
          style: { color: "#fff", height: "auto" }, // Text color and height
        },
      }}
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label="Ingresá los nombres línea por línea"
      InputLabelProps={{
        style: { color: "#fff" }, // Label color
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "white", // Border color
          },
          "&:hover fieldset": {
            borderColor: "white", // Border color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "white", // Border color when focused
          },
        },
        width: 300, // Adjust based on your layout needs
      }}
    />
  );
};

export default CustomTextField;

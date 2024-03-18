import { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import styled from "styled-components";

// Define a custom styled component for the TextField
const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root:not(.Mui-focused) .MuiOutlinedInput-notchedOutline {
    border-color: #fff;
  }
  & .MuiInputLabel-root:not(.Mui-focused) {
    color: #fff;
  }

  /* Customize the label color when clicked */
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #fff;
  }
  & .MuiInputLabel-root.Mui-focused {
    color: #fff;
  }

  & textarea {
    resize: none;
    color: white;
    width: 25rem;
    margin: 0;
  }
`;

interface CustomTextFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  value,
  onChange,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <StyledTextField
      id="players"
      multiline
      fullWidth
      rows={4}
      variant="outlined"
      label="Ingresá los nombres línea por línea"
      value={value}
      onChange={handleChange}
      inputRef={textAreaRef}
      autoFocus
    />
  );
};

export default CustomTextField;

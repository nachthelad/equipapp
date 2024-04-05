import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Box, Typography, Snackbar, Alert } from "@mui/material";
import CustomTextField from "./CustomTextField";
import InfoDialog from "./InfoDialog";
import { PlayerFormProps } from "@/types";

export default function PlayerForm({ onFormSubmit }: PlayerFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      players: "",
    },
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const vertical = "bottom";
  const horizontal = "center";

  useEffect(() => {
    if (errors.players) {
      setSnackbarMessage(errors.players.message ?? "");
      setOpenSnackbar(true);
    }
  }, [errors.players]);

  const onSubmit = (data: { players: string }) => {
    const cleanedLines = data.players
      .split(/\r?\n/)
      .filter((line: string) => line.trim() !== "")
      .map((line: string) =>
        line
          .replace(
            /[^a-zA-Z0-9\s🧤áéíóúÁÉÍÓÚ]|(?<![a-zA-Z\sáéíóúÁÉÍÓÚ])\d+/g,
            ""
          )
          .trim()
          .toLowerCase()
          .replace(/(^\w|\s\w|🧤\w)/g, (char: string) => char.toUpperCase())
      );

    if ([8, 10, 14, 16].includes(cleanedLines.length)) {
      onFormSubmit(cleanedLines);
    } else {
      setError("players", {
        type: "manual",
        message: "La cantidad de jugadores debe ser 8, 10, 14 o 16",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Button
            onClick={() => setOpenDialog(true)}
            variant="contained"
            sx={{
              my: 2,
              borderRadius: "20px",
              backgroundColor: "gray",
              "&:hover": {
                backgroundColor: "gray",
              },
            }}>
            <Typography variant="caption">¿Cómo usar?</Typography>
          </Button>
          <CustomTextField {...register("players", { required: "" })} />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, borderRadius: "20px" }}>
            Siguiente
          </Button>
        </Box>
      </form>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <InfoDialog open={openDialog} handleClose={() => setOpenDialog(false)} />
    </>
  );
}

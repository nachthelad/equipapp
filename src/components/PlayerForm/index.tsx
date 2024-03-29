import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CustomTextField from "./CustomTextField";

type PlayerFormProps = {
  onFormSubmit: (playerNames: string[]) => void; // Change the type of the function
};

export default function PlayerForm({ onFormSubmit }: PlayerFormProps) {
  const [players, setPlayers] = useState("");
  const [open, setOpen] = useState(false);
  const [_cleanedLines, setCleanedLines] = useState<string[]>([]); // Add state for cleaned lines
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const playerNames = players
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");

    const cleanedLines = playerNames.map((line) => {
      let cleanedLine = line
        .replace(/[^a-zA-Z0-9\s🧤áéíóúÁÉÍÓÚ]|(?<![a-zA-Z\sáéíóúÁÉÍÓÚ])\d+/g, "")
        .trim()
        .toLowerCase();
      return cleanedLine.replace(/(^\w|\s\w|🧤\w)/g, (char) =>
        char.toUpperCase()
      );
    });

    if (validatePlayerCount(cleanedLines)) {
      onFormSubmit(cleanedLines);
      setCleanedLines(cleanedLines);
    } else {
      setSnackbarMessage("La cantidad de jugadores debe ser 8, 10, 14 o 16");
      setOpenSnackbar(true);
    }
  };

  function validatePlayerCount(cleanedLines: string[]): boolean {
    return [8, 10, 14, 16].includes(cleanedLines.length);
  }

  const handleInfoClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const infoDialog = (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: { backgroundColor: "#64748b", borderRadius: 20, color: "#fff" },
      }}>
      <DialogTitle>{"¿Cómo usar?"}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#fff" }}>
          ➡️ Ponele el emoji de los guantes (🧤) a quienes van a ser arqueros
          para que aparezcan seleccionados automáticamente.
        </DialogContentText>
        <DialogContentText sx={{ color: "#fff" }}>
          ➡️ Podés agregar 8, 10, 14 o 16 nombres, uno por línea.
        </DialogContentText>
        <DialogContentText sx={{ color: "#fff" }}>
          ➡️ Sólo en los partidos de 16 personas se pueden elegir las
          posiciones.
        </DialogContentText>
        <DialogActions>
          <Button
            className="actionButton"
            variant="contained"
            onClick={handleClose}
            color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );

  return (
    <form onSubmit={handleSubmit}>
      {infoDialog}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}>
          <Button
            onClick={handleInfoClick}
            variant="contained"
            className="actionButton"
            sx={{
              marginY: 2,
              display: "flex",
              alignContent: "flex-start",
              backgroundColor: "gray",
              "&:hover": {
                backgroundColor: "gray",
              },
            }}>
            <Typography variant="caption">¿Cómo usar?</Typography>{" "}
          </Button>
        </Box>
        <CustomTextField value={players} onChange={setPlayers} />
        <Box
          sx={{
            paddingY: "1rem",
            display: "flex",
            justifyContent: "center",
          }}>
          <Button
            className="actionButton"
            type="submit"
            variant="contained"
            color="primary">
            Siguiente
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}>
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </form>
  );
}

import { useState } from "react";
import {
  Button,
  IconButton,
  Tooltip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CustomTextField from "./CustomTextField";

type PlayerFormProps = {
  onFormSubmit: (playerNames: string[]) => void; // Change the type of the function
};

export default function PlayerForm({ onFormSubmit }: PlayerFormProps) {
  const [players, setPlayers] = useState("");
  const [open, setOpen] = useState(false);
  const [_cleanedLines, setCleanedLines] = useState<string[]>([]); // Add state for cleaned lines

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
      console.log(cleanedLines);
      onFormSubmit(cleanedLines);
      setCleanedLines(cleanedLines);
    } else {
      alert("La cantidad de jugadores debe ser 8, 10, 14 o 16");
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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{"Sugerencia"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Si le agregas el emoji de los guantes (🧤) a quienes van a ser
          arqueros, van a aparecer seleccionados como arqueros automáticamente.
        </DialogContentText>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );

  return (
    <form onSubmit={handleSubmit}>
      {infoDialog}
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item sx={{ paddingLeft: "0 !important" }}>
          <Tooltip title="Sugerencia" placement="top">
            <IconButton onClick={handleInfoClick}>
              <InfoIcon sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <CustomTextField value={players} onChange={setPlayers} />
        <Grid item>
          <Button type="submit" variant="contained" color="primary">
            Siguiente
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

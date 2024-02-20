import { useState } from "react";
import {
  Button,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Image from "next/image";
import CustomTextField from "./CustomTextField";

interface PlayerFormProps {
  onSubmit: (players: string[]) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onSubmit }) => {
  const [players, setPlayers] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const playerNames = players
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");

    const cleanedLines = playerNames.map((line)=> {
        let cleanedLine = line.replace(/[^a-zA-Z0-9\s🧤]|(?<![a-zA-Z\s])\d+/g, "")
        .trim();
        return cleanedLine.replace(/\b\w/g, (char) => char.toUpperCase());
    });

    if (validatePlayerCount(cleanedLines)) {
      onSubmit(cleanedLines);
      alert("Todo ok");
    } else {
      alert("La cantidad de jugadores debe ser 10, 14 o 16");
    }
  };

  function validatePlayerCount(cleanedLines: string[]): boolean {
    return [10, 14, 16].includes(cleanedLines.length);
  }

  const handleInfoClick = () => {
    alert(
      "Si le agregas el emoji de los guantes (🧤) a quienes van a ser arqueros, aparecerán seleccionados como arqueros automáticamente. (Solo en 8v8)"
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container direction="column" spacing={2} alignItems="center">
        <Grid item>
          <Image src="/logo.png" alt="Logo" width={330} height={200} />
        </Grid>
        <Grid item>
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
};

export default PlayerForm;

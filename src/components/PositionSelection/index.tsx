"use client";
import { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

type PlayerPosition = "Arquero" | "Defensa" | "Mediocampista" | "Delantero";

type PlayerWithPosition = {
  name: string;
  position: PlayerPosition;
};

type PositionSelectionProps = {
  playerNames: string[];
  onPositionSelection: (playersWithPositions: PlayerWithPosition[]) => void;
};

export default function PositionSelection({
  playerNames,
  onPositionSelection,
}: PositionSelectionProps) {
  const [playersWithPositions, setPlayersWithPositions] = useState<
    PlayerWithPosition[]
  >(
    playerNames.map((name) => ({
      name,
      position: name.includes("🧤") ? "Arquero" : "Mediocampista", // Default a Mediocampista, a menos que tenga el emoji de guante.
    }))
  );

  const handlePositionChange = (index: number, position: PlayerPosition) => {
    const newPlayersWithPositions = [...playersWithPositions];
    newPlayersWithPositions[index].position = position;
    setPlayersWithPositions(newPlayersWithPositions);
  };

  return (
    <div>
      <Box>
        {playersWithPositions && playersWithPositions.length > 0 ? (
          playersWithPositions.map((player, index) => (
            <Box key={index} sx={{ marginBottom: 2, textAlign: "center" }}>
              <Typography variant="body1">
                {player.name.replace("🧤", "")}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name={`position-${index}`}
                  value={player.position}
                  onChange={(event) =>
                    handlePositionChange(
                      index,
                      event.target.value as PlayerPosition
                    )
                  }>
                  <FormControlLabel
                    value="Arquero"
                    control={<Radio />}
                    label="Arquero"
                  />
                  <FormControlLabel
                    value="Defensa"
                    control={<Radio />}
                    label="Defensa"
                  />
                  <FormControlLabel
                    value="Mediocampista"
                    control={<Radio />}
                    label="Mediocampista"
                  />
                  <FormControlLabel
                    value="Delantero"
                    control={<Radio />}
                    label="Delantero"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No se encontraron jugadores.</Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
        <Button variant="contained">Atrás</Button>
        <Button
          variant="contained"
          onClick={() => onPositionSelection(playersWithPositions)}>
          Siguiente
        </Button>
      </Box>
    </div>
  );
}

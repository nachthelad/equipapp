"use client";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import Image from "next/image";
import PlayerForm from "@/components/PlayerForm";
import PositionSelection from "@/components/PositionSelection";
import Teams from "@/components/Teams";

export default function MainPage() {
  const [step, setStep] = useState(1);
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const handleFormSubmit = (names: string[]) => {
    setPlayerNames(names);
    setStep(2); // Avanza al siguiente paso después de enviar el formulario
  };

  const handlePositionSelection = () => {
    setStep(3); // Avanza después de la selección de posiciones
  };

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      alignItems="center"
      xs={12}
      sx={{
        display: "flex",
        justifyContent: "center",
        "@media (max-width: 600px)": {
          justifyContent: "center",
        },
      }}>
      <Grid item>
        <Image src="/logo.png" alt="Logo Equipapp" width={330} height={200} />
      </Grid>
      <Grid item>
        {step === 1 && <PlayerForm onFormSubmit={handleFormSubmit} />}
        {step === 2 && (
          <PositionSelection
            playerNames={playerNames}
            onPositionSelection={handlePositionSelection}
          />
        )}
        {step === 3 && <Teams playerNames={playerNames} />}
      </Grid>
    </Grid>
  );
}

"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Grid } from "@mui/material";
import PlayerForm from "@/components/PlayerForm";
import PositionSelection from "../PositionSelection";
import Teams from "@/components/Teams";

export default function MainPage() {
  const [step, setStep] = useState(1); // Initialize step state

  // Function to handle moving to the next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Render different components based on the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return <PlayerForm onNextStep={nextStep} />;
      case 2:
        return <PositionSelection onNextStep={nextStep} />;
      case 3:
        return <Teams />;
      default:
        return null;
    }
  };

  return (
    <>
      <Grid container direction="column" spacing={1} alignItems="center">
        <Grid item>
          <Image src="/logo.png" alt="Logo" width={330} height={200} />
        </Grid>
        <Grid item>{renderStep()}</Grid>
      </Grid>
    </>
  );
}

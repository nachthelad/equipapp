"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import PlayerForm from "@/components/PlayerForm";
import PositionSelection from "@/components/PositionSelection";
import Teams from "@/components/Teams";
import { PlayerWithPosition, TeamsData } from "@/types";

export default function MainPage() {
  const [step, setStep] = useState(1);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [teamOne, setTeamOne] = useState<PlayerWithPosition[]>([]);
  const [teamTwo, setTeamTwo] = useState<PlayerWithPosition[]>([]);

  const handleFormSubmit = (names: string[]) => {
    setPlayerNames(names);
    setStep(2);
  };

  const handlePositionSelection = ({ teamOne, teamTwo }: TeamsData) => {
    setTeamOne(teamOne);
    setTeamTwo(teamTwo);
    setStep(3);
  };
  const goBackToMainPage = () => {
    setStep(1);
  };

  return (
    <Box sx={{ alignItems: "center", marginTop: "2rem", paddingLeft: "0" }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {step === 3 ? null : (
          <Image src="/logo.png" alt="Logo Equipapp" width={330} height={200} />
        )}
      </Box>
      <Box>
        {step === 1 && <PlayerForm onFormSubmit={handleFormSubmit} />}
        {step === 2 && (
          <PositionSelection
            playerNames={playerNames}
            onPositionSelection={handlePositionSelection}
            onGoBack={goBackToMainPage}
          />
        )}
        {step === 3 && (
          <Teams
            teamOne={teamOne}
            teamTwo={teamTwo}
            onGoBack={goBackToMainPage}
          />
        )}
      </Box>
    </Box>
  );
}

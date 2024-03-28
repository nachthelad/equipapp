"use client";
import React, { useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import Image from "next/image";
import PlayerForm from "@/components/PlayerForm";
import PositionSelection from "@/components/PositionSelection";
import Teams from "@/components/Teams";
import { PlayerWithPosition, TeamsData } from "@/types";
import { shuffle } from "lodash";
import { AnimatePresence, motion } from "framer-motion";

export default function MainPage() {
  const [step, setStep] = useState(1);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [teamOne, setTeamOne] = useState<PlayerWithPosition[]>([]);
  const [teamTwo, setTeamTwo] = useState<PlayerWithPosition[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFormSubmit = (names: string[]) => {
    setPlayerNames(names);

    const goalkeepers = names.filter((name) => name.includes("🧤"));
    const otherPlayers = names.filter((name) => !name.includes("🧤"));

    if (goalkeepers.length === 1) {
      setSnackbarMessage("Por favor, poné 2 🧤 o no pongas ninguno");
      setOpenSnackbar(true);
      return;
    }

    if (names.length !== 16) {
      const shuffledOtherPlayers = shuffle(otherPlayers);
      let teamOne = [];
      let teamTwo = [];

      if (goalkeepers.length === 2) {
        teamOne.push(goalkeepers[0]);
        teamTwo.push(goalkeepers[1]);
      }

      teamOne = teamOne.concat(
        shuffledOtherPlayers.slice(0, shuffledOtherPlayers.length / 2)
      );
      teamTwo = teamTwo.concat(
        shuffledOtherPlayers.slice(shuffledOtherPlayers.length / 2)
      );

      const teamOneWithPositions: PlayerWithPosition[] = teamOne.map(
        (name) => ({
          name,
          position: name.includes("🧤") ? "Arco" : "Jugador",
        })
      );

      const teamTwoWithPositions: PlayerWithPosition[] = teamTwo.map(
        (name) => ({
          name,
          position: name.includes("🧤") ? "Arco" : "Jugador",
        })
      );

      setTeamOne(teamOneWithPositions);
      setTeamTwo(teamTwoWithPositions);
      setStep(3);
    } else {
      setStep(2);
    }
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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
      }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {step === 2 || step === 3 ? null : (
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
        <AnimatePresence>
          {step === 3 && (
            <motion.div
              key="teams"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "linear" }}>
              <Teams
                teamOne={teamOne}
                teamTwo={teamTwo}
                onGoBack={goBackToMainPage}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
    </Box>
  );
}

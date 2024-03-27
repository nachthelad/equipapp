import { shuffle } from "lodash";
import { useState } from "react";
import { Button, Typography, Box, Snackbar, Alert } from "@mui/material";
import { PlayerWithPosition } from "@/types";

export default function Teams({
  teamOne,
  teamTwo,
  onGoBack,
}: {
  teamOne: PlayerWithPosition[];
  teamTwo: PlayerWithPosition[];
  onGoBack: () => void;
}) {
  const [currentTeamOne, setCurrentTeamOne] = useState(teamOne);
  const [currentTeamTwo, setCurrentTeamTwo] = useState(teamTwo);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const reorganizeTeams = () => {
    const combinedTeams = [...teamOne, ...teamTwo];
    const shuffledPlayers = shuffle(combinedTeams);

    const goalkeepers = shuffledPlayers.filter(
      (player) => player.position === "Arco"
    );
    const defenders = shuffledPlayers.filter(
      (player) => player.position === "Def"
    );
    const midfielders = shuffledPlayers.filter(
      (player) => player.position === "Medio"
    );
    const forwards = shuffledPlayers.filter(
      (player) => player.position === "Del"
    );

    let newTeamOne = [],
      newTeamTwo = [];

    if (goalkeepers.length > 1) {
      newTeamOne.push(goalkeepers[0]);
      newTeamTwo.push(goalkeepers[1]);
    } else if (goalkeepers.length === 1) {
      newTeamOne.push(goalkeepers[0]);
    }

    newTeamOne = newTeamOne.concat(defenders.slice(0, 3));
    newTeamTwo = newTeamTwo.concat(defenders.slice(3, 6));

    newTeamOne = newTeamOne.concat(midfielders.slice(0, 3));
    newTeamTwo = newTeamTwo.concat(midfielders.slice(3, 6));

    if (forwards.length > 1) {
      newTeamOne.push(forwards[0]);
      newTeamTwo.push(forwards[1]);
    } else if (forwards.length === 1) {
      newTeamOne.push(forwards[0]);
    } else {
      newTeamOne = newTeamOne.concat(midfielders.slice(3, 4));
      newTeamTwo = newTeamTwo.concat(midfielders.slice(6, 7));
    }

    setCurrentTeamOne(newTeamOne);
    setCurrentTeamTwo(newTeamTwo);
  };

  const copyTeamsToClipboard = () => {
    const teamOneText = currentTeamOne
      .map((player) => `${player.name.replace("🧤", "")} (${player.position})`)
      .join("\n");
    const teamTwoText = currentTeamTwo
      .map((player) => `${player.name.replace("🧤", "")} (${player.position})`)
      .join("\n");
    const fullText = `EQUIPO 1: NEGRO\n${teamOneText}\n\nEQUIPO 2: BLANCO\n${teamTwoText}`;

    navigator.clipboard.writeText(fullText).then(
      () => {
        setSnackbarMessage("Texto copiado al portapapeles");
        setOpenSnackbar(true);
      },
      (err) => {
        console.error("Error al copiar texto: ", err);
      }
    );
  };

  const sendViaWhatsApp = () => {
    const teamOneText = currentTeamOne
      .map((player) => `${player.name.replace("🧤", "")} (${player.position})`)
      .join("%0A");
    const teamTwoText = currentTeamTwo
      .map((player) => `${player.name.replace("🧤", "")} (${player.position})`)
      .join("%0A");
    const fullText = `EQUIPO 1: NEGRO%0A${teamOneText}%0A%0AEQUIPO 2: BLANCO%0A${teamTwoText}`;

    const whatsappUrl = `https://wa.me/?text=${fullText}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: 'url("/icon.svg")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundBlendMode: "lighten",
        width: "100%",
        height: "100vh",
      }}>
      <Typography variant="h5">EQUIPO 1: NEGRO</Typography>
      {currentTeamOne.map((player, index) => (
        <Box key={index}>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.1rem" }}>{`${player.name.replace("🧤", "")} (${
            player.position
          })`}</Typography>
        </Box>
      ))}

      <Typography variant="h5" sx={{ marginTop: 2 }}>
        EQUIPO 2: BLANCO
      </Typography>
      {currentTeamTwo.map((player, index) => (
        <Box key={index}>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.1rem" }}>{`${player.name.replace("🧤", "")} (${
            player.position
          })`}</Typography>
        </Box>
      ))}

      <Button
        className="actionButton"
        variant="contained"
        color="primary"
        onClick={reorganizeTeams}
        sx={{ marginY: 2 }}>
        Volver a sortear
      </Button>
      <Box
        sx={{ display: "flex", justifycontent: "center", gap: 1, marginY: 1 }}>
        <Button
          className="actionButton"
          variant="contained"
          color="primary"
          onClick={onGoBack}>
          Volver al inicio
        </Button>
        <Button
          className="actionButton"
          variant="contained"
          color="primary"
          onClick={copyTeamsToClipboard}>
          Copiar
        </Button>
        <Button
          className="actionButton"
          variant="contained"
          color="primary"
          onClick={sendViaWhatsApp}>
          Enviar
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

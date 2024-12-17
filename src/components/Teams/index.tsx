import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { PlayerWithPosition } from "@/types";
import RandomizeTeamsButton from "@/components/Teams/RandomizeTeamsButton";
import CopyTeamsButton from "@/components/Teams/CopyTeamsButton";
import SendTeamsButton from "@/components/Teams/SendTeamsButton";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: 'url("/icon-op.svg")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        width: "100vw",
        color: "white",
        marginTop: 1,
      }}
    >
      <Typography variant={isMobile ? "h5" : "h6"} color="common.white">
        EQUIPO 1: NEGRO
      </Typography>
      {currentTeamOne.map((player, index) => (
        <Box key={index}>
          <Typography
            variant="body1"
            color="common.white"
            sx={{ fontSize: isMobile ? "1rem" : "1.1rem" }}
          >
            {player.position !== "Jugador"
              ? `${player.name.replace("🧤", "")} (${player.position})`
              : `${player.name.replace("🧤", "")}`}
          </Typography>
        </Box>
      ))}

      <Typography
        variant={isMobile ? "h5" : "h6"}
        color="common.white"
        sx={{ marginTop: 1 }}
      >
        EQUIPO 2: BLANCO
      </Typography>
      {currentTeamTwo.map((player, index) => (
        <Box key={index}>
          <Typography
            variant="body1"
            color="common.white"
            sx={{ fontSize: isMobile ? "1rem" : "1.1rem" }}
          >
            {player.position !== "Jugador"
              ? `${player.name.replace("🧤", "")} (${player.position})`
              : `${player.name.replace("🧤", "")}`}
          </Typography>
        </Box>
      ))}

      <RandomizeTeamsButton
        teamOne={currentTeamOne}
        teamTwo={currentTeamTwo}
        setTeamOne={setCurrentTeamOne}
        setTeamTwo={setCurrentTeamTwo}
      />
      <Box
        sx={{
          display: "flex",
          justifycontent: "center",
          gap: 1,
          marginBottom: 3,
        }}
      >
        <Button
          className="actionButton"
          variant="contained"
          color="primary"
          onClick={onGoBack}
        >
          Volver al inicio
        </Button>
        <CopyTeamsButton
          teamOne={currentTeamOne}
          teamTwo={currentTeamTwo}
          setSnackbarMessage={setSnackbarMessage}
          setOpenSnackbar={setOpenSnackbar}
        />
        <SendTeamsButton teamOne={currentTeamOne} teamTwo={currentTeamTwo} />
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

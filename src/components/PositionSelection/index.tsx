import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  ButtonGroup,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  PlayerWithPosition,
  PlayerPosition,
  PositionSelectionProps,
} from "@/types";
import { shuffle } from "lodash";

export default function PositionSelection({
  playerNames,
  onPositionSelection,
  onGoBack,
}: PositionSelectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [playersWithPositions, setPlayersWithPositions] = useState<
    PlayerWithPosition[]
  >(
    playerNames.map((name) => ({
      name,
      position: name.includes("🧤") ? "Arco" : "Medio",
    }))
  );

  const handlePositionChange = (index: number, position: PlayerPosition) => {
    const newPlayersWithPositions = [...playersWithPositions];
    newPlayersWithPositions[index].position = position;
    setPlayersWithPositions(newPlayersWithPositions);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validateAndProceed = () => {
    const numberOfDefenders = playersWithPositions.filter(
      (player) => player.position === "Def"
    ).length;
    const numberOfGoalkeepers = playersWithPositions.filter(
      (player) => player.position === "Arco"
    ).length;

    if (numberOfDefenders < 6 || numberOfDefenders > 6) {
      setSnackbarMessage("Debe haber 6 defensores seleccionados.");
      setOpenSnackbar(true);
      return;
    }

    if (numberOfGoalkeepers > 2 || numberOfGoalkeepers < 2) {
      setSnackbarMessage("Solo puede haber 2 arqueros seleccionados.");
      setOpenSnackbar(true);
      return;
    }

    const goalkeepers = shuffle(
      playersWithPositions.filter((player) => player.position === "Arco")
    );
    const defenders = shuffle(
      playersWithPositions.filter((player) => player.position === "Def")
    );
    const midfielders = shuffle(
      playersWithPositions.filter((player) => player.position === "Medio")
    );
    const forwards = shuffle(
      playersWithPositions.filter((player) => player.position === "Del")
    );

    let teamOne = [
      goalkeepers[0],
      ...defenders.slice(0, 3),
      ...midfielders.slice(0, forwards.length > 0 ? 3 : 4),
    ];

    let teamTwo = [
      goalkeepers[1],
      ...defenders.slice(3, 6),
      ...midfielders.slice(
        forwards.length > 0 ? 3 : 4,
        forwards.length > 0 ? 6 : 8
      ),
    ];

    if (forwards.length > 0) {
      teamOne.push(forwards[0]);
      if (forwards.length > 1) {
        teamTwo.push(forwards[1]);
      }
    }

    onPositionSelection({ teamOne, teamTwo });
  };
  return (
    <div>
      <Box>
        {playersWithPositions && playersWithPositions.length > 0 ? (
          playersWithPositions.map((player, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 1,
                  marginTop: index === 0 ? 2 : 0,
                  fontWeight: 600,
                }}>
                {player.name.replace("🧤", "")}
              </Typography>
              <ButtonGroup
                variant="contained"
                aria-label="position selection"
                fullWidth={isMobile}
                size={"large"}>
                {(["Arco", "Def", "Medio", "Del"] as PlayerPosition[]).map(
                  (position) => (
                    <Button
                      key={position}
                      color={
                        player.position === position ? "primary" : "inherit"
                      }
                      sx={{
                        backgroundColor:
                          player.position === position ? "" : "#e0e0e0",
                        "&:hover": {
                          backgroundColor:
                            player.position === position ? "" : "#d5d5d5",
                        },
                      }}
                      onClick={() => handlePositionChange(index, position)}>
                      {position}
                    </Button>
                  )
                )}
              </ButtonGroup>
            </Box>
          ))
        ) : (
          <Typography variant="body1">No se encontraron jugadores.</Typography>
        )}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", gap: 1, marginY: 2 }}>
        <Button className="actionButton" variant="contained" onClick={onGoBack}>
          Atrás
        </Button>
        <Button
          className="actionButton"
          variant="contained"
          onClick={validateAndProceed}>
          Siguiente
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

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
import { motion } from "framer-motion";

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

    if (numberOfDefenders !== 6) {
      setSnackbarMessage("Debe haber 6 defensores seleccionados.");
      setOpenSnackbar(true);
      return;
    }

    if (numberOfGoalkeepers !== 2) {
      setSnackbarMessage("Debe haber 2 arqueros seleccionados.");
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
          width: "100%",
        }}>
        {playersWithPositions && playersWithPositions.length > 0 ? (
          playersWithPositions.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }} 
              style={{ marginBottom: 2 }}>
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 1,
                  fontWeight: 500,
                }}>
                {player.name.replace("🧤", "")}
              </Typography>
              <ButtonGroup
                variant="contained"
                aria-label="position selection"
                fullWidth={isMobile}
                size={"large"}>
                {(["Arco", "Def", "Medio", "Del"] as PlayerPosition[]).map(
                  (position, posIndex) => (
                    <motion.button
                      key={position}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + posIndex * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        border: 0,
                        borderRadius:
                          posIndex === 1 || posIndex === 2
                            ? "0px"
                            : posIndex === 0
                            ? "5px 0px 0px 5px"
                            : "0px 5px 5px 0px",
                        padding: "14px 18px",
                        cursor: "pointer",
                        boxShadow: "0",
                        background:
                          player.position === position ? "#1976d2" : "#e0e0e0",
                        color: player.position === position ? "#fff" : "#000",
                      }}
                      onClick={() => handlePositionChange(index, position)}>
                      {position}
                    </motion.button>
                  )
                )}
              </ButtonGroup>
            </motion.div>
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
        autoHideDuration={2000}
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

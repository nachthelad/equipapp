import React from "react";
import { Button } from "@mui/material";
import { PlayerWithPosition } from "@/types";
import { shuffle } from "lodash";

interface RandomizeTeamsProps {
  teamOne: PlayerWithPosition[];
  teamTwo: PlayerWithPosition[];
  setTeamOne: React.Dispatch<React.SetStateAction<PlayerWithPosition[]>>;
  setTeamTwo: React.Dispatch<React.SetStateAction<PlayerWithPosition[]>>;
}

const RandomizeTeamsButton: React.FC<RandomizeTeamsProps> = ({
  teamOne,
  teamTwo,
  setTeamOne,
  setTeamTwo,
}) => {
  const reorganizeTeams = () => {
    const shuffledPlayers = shuffle([...teamOne, ...teamTwo]);

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
    const players = shuffledPlayers.filter(
      (player) => player.position === "Jugador"
    );

    const positionOrder = ["Arco", "Def", "Medio", "Del", "Jugador"];

    const comparePositions = (a: PlayerWithPosition, b: PlayerWithPosition) => {
      return (
        positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
      );
    };

    let newTeamOne: PlayerWithPosition[] = [];
    let newTeamTwo: PlayerWithPosition[] = [];

    [
      ...goalkeepers,
      ...defenders,
      ...midfielders,
      ...forwards,
      ...players,
    ].forEach((player, index) => {
      if (index % 2 === 0) newTeamOne.push(player);
      else newTeamTwo.push(player);
    });

    newTeamOne.sort(comparePositions);
    newTeamTwo.sort(comparePositions);

    setTeamOne(newTeamOne);
    setTeamTwo(newTeamTwo);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={reorganizeTeams}
      sx={{ borderRadius: "20px", marginTop: 3, marginBottom: 2 }}>
      Volver a sortear
    </Button>
  );
};

export default RandomizeTeamsButton;

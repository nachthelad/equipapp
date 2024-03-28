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
    const player = shuffledPlayers.filter(
      (player) => player.position === "Jugador"
    );

    let newTeamOne: PlayerWithPosition[] = [];
    let newTeamTwo: PlayerWithPosition[] = [];

    if (goalkeepers.length >= 2) {
      newTeamOne.push(goalkeepers[0]);
      newTeamTwo.push(goalkeepers[1]);
    }

    const halfPlayers = Math.ceil(player.length / 2);

    newTeamOne = newTeamOne.concat(player.slice(0, halfPlayers));
    newTeamTwo = newTeamTwo.concat(player.slice(halfPlayers));

    const halfDefenders = Math.ceil(defenders.length / 2);
    const halfMidfielders = Math.ceil(midfielders.length / 2);
    const halfForwards = Math.ceil(forwards.length / 2);

    newTeamOne = newTeamOne.concat(defenders.slice(0, halfDefenders));
    newTeamTwo = newTeamTwo.concat(defenders.slice(halfDefenders));

    newTeamOne = newTeamOne.concat(midfielders.slice(0, halfMidfielders));
    newTeamTwo = newTeamTwo.concat(midfielders.slice(halfMidfielders));

    newTeamOne = newTeamOne.concat(forwards.slice(0, halfForwards));
    newTeamTwo = newTeamTwo.concat(forwards.slice(halfForwards));

    newTeamOne.sort((a, b) => a.position.localeCompare(b.position));
    newTeamTwo.sort((a, b) => a.position.localeCompare(b.position));

    setTeamOne(newTeamOne);
    setTeamTwo(newTeamTwo);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={reorganizeTeams}
      sx={{ borderRadius: "20px" }}>
      Volver a sortear
    </Button>
  );
};

export default RandomizeTeamsButton;

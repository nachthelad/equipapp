"use client";
import { useState } from "react";
import type { PlayerWithPosition } from "@/types";

export function useTeamGeneration() {
  const [teamOne, setTeamOne] = useState<PlayerWithPosition[]>([]);
  const [teamTwo, setTeamTwo] = useState<PlayerWithPosition[]>([]);

  const generateBalancedTeams = (players: PlayerWithPosition[]) => {
    // Use Fisher-Yates shuffle for better randomization
    const shuffledPlayers = [...players];
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [
        shuffledPlayers[j],
        shuffledPlayers[i],
      ];
    }

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
    const regularPlayers = shuffledPlayers.filter(
      (player) => player.position === "Jugador"
    );

    const positionOrder = ["Arco", "Def", "Medio", "Del", "Jugador"];
    const comparePositions = (a: PlayerWithPosition, b: PlayerWithPosition) => {
      return (
        positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position)
      );
    };

    const newTeamOne: PlayerWithPosition[] = [];
    const newTeamTwo: PlayerWithPosition[] = [];

    // Distribute players evenly
    const allPlayers = [
      ...goalkeepers,
      ...defenders,
      ...midfielders,
      ...forwards,
      ...regularPlayers,
    ];
    allPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        newTeamOne.push(player);
      } else {
        newTeamTwo.push(player);
      }
    });

    // Sort by position
    newTeamOne.sort(comparePositions);
    newTeamTwo.sort(comparePositions);

    setTeamOne(newTeamOne);
    setTeamTwo(newTeamTwo);

    return { teamOne: newTeamOne, teamTwo: newTeamTwo };
  };

  const generateSimpleTeams = (playerNames: string[]) => {
    const goalkeepers = playerNames.filter((name) => name.includes("🧤"));
    const otherPlayers = playerNames.filter((name) => !name.includes("🧤"));
    // Use Fisher-Yates shuffle for better randomization
    const shuffledOtherPlayers = [...otherPlayers];
    for (let i = shuffledOtherPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOtherPlayers[i], shuffledOtherPlayers[j]] = [
        shuffledOtherPlayers[j],
        shuffledOtherPlayers[i],
      ];
    }

    let teamOneNames = [];
    let teamTwoNames = [];

    if (goalkeepers.length === 2) {
      teamOneNames.push(goalkeepers[0]);
      teamTwoNames.push(goalkeepers[1]);
    }

    teamOneNames = teamOneNames.concat(
      shuffledOtherPlayers.slice(0, Math.floor(shuffledOtherPlayers.length / 2))
    );
    teamTwoNames = teamTwoNames.concat(
      shuffledOtherPlayers.slice(Math.floor(shuffledOtherPlayers.length / 2))
    );

    const teamOneWithPositions: PlayerWithPosition[] = teamOneNames.map(
      (name) => ({
        name,
        position: name.includes("🧤") ? "Arco" : "Jugador",
      })
    );

    const teamTwoWithPositions: PlayerWithPosition[] = teamTwoNames.map(
      (name) => ({
        name,
        position: name.includes("🧤") ? "Arco" : "Jugador",
      })
    );

    setTeamOne(teamOneWithPositions);
    setTeamTwo(teamTwoWithPositions);

    return { teamOne: teamOneWithPositions, teamTwo: teamTwoWithPositions };
  };

  const redistributeTeams = () => {
    const allPlayers = [...teamOne, ...teamTwo];
    return generateBalancedTeams(allPlayers);
  };

  const resetTeams = () => {
    setTeamOne([]);
    setTeamTwo([]);
  };

  return {
    teamOne,
    teamTwo,
    setTeamOne,
    setTeamTwo,
    generateBalancedTeams,
    generateSimpleTeams,
    redistributeTeams,
    resetTeams,
  };
}

"use client";
import { useState } from "react";
import type { PlayerWithPosition } from "@/types";

export function useTeamGeneration() {
  const [teamOne, setTeamOne] = useState<PlayerWithPosition[]>([]);
  const [teamTwo, setTeamTwo] = useState<PlayerWithPosition[]>([]);

  const generateBalancedTeams = (players: PlayerWithPosition[]) => {
    const shuffledPlayers = [...players];
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [
        shuffledPlayers[j],
        shuffledPlayers[i],
      ];
    }

    const grouped: Record<string, PlayerWithPosition[]> = {
      Arco: [],
      Def: [],
      Medio: [],
      Del: [],
      Jugador: [],
    };
    for (let i = 0; i < shuffledPlayers.length; i++) {
      const player = shuffledPlayers[i];
      if (grouped[player.position]) {
        grouped[player.position].push(player);
      }
    }

    const positionRank: Record<string, number> = {
      Arco: 0,
      Def: 1,
      Medio: 2,
      Del: 3,
      Jugador: 4,
    };
    const comparePositions = (a: PlayerWithPosition, b: PlayerWithPosition) => {
      return (positionRank[a.position] ?? 5) - (positionRank[b.position] ?? 5);
    };

    const newTeamOne: PlayerWithPosition[] = [];
    const newTeamTwo: PlayerWithPosition[] = [];

    const allPlayers = [
      ...grouped.Arco,
      ...grouped.Def,
      ...grouped.Medio,
      ...grouped.Del,
      ...grouped.Jugador,
    ];
    allPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        newTeamOne.push(player);
      } else {
        newTeamTwo.push(player);
      }
    });

    newTeamOne.sort(comparePositions);
    newTeamTwo.sort(comparePositions);

    setTeamOne(newTeamOne);
    setTeamTwo(newTeamTwo);

    return { teamOne: newTeamOne, teamTwo: newTeamTwo };
  };

  const generateSimpleTeams = (playerNames: string[]) => {
    const goalkeeperSet = new Set(playerNames.filter((name) => name.includes("🧤")));
    const otherPlayers = playerNames.filter((name) => !name.includes("🧤"));
    const shuffledOtherPlayers = [...otherPlayers];
    for (let i = shuffledOtherPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOtherPlayers[i], shuffledOtherPlayers[j]] = [
        shuffledOtherPlayers[j],
        shuffledOtherPlayers[i],
      ];
    }

    let teamOneNames: string[] = [];
    let teamTwoNames: string[] = [];

    const goalkeepers = Array.from(goalkeeperSet);
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
        position: goalkeeperSet.has(name) ? "Arco" : "Jugador",
      })
    );

    const teamTwoWithPositions: PlayerWithPosition[] = teamTwoNames.map(
      (name) => ({
        name,
        position: goalkeeperSet.has(name) ? "Arco" : "Jugador",
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

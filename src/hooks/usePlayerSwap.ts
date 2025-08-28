"use client";
import { useCallback } from "react";
import type { PlayerWithPosition } from "@/types";
import { useAppStore } from "@/store/appStore";

export interface PlayerSwapData {
  fromTeam: "teamOne" | "teamTwo";
  toTeam: "teamOne" | "teamTwo";
  fromIndex: number;
  toIndex: number;
  draggedPlayer: PlayerWithPosition;
  targetPlayer: PlayerWithPosition;
}

interface UsePlayerSwapProps {
  teamOne: PlayerWithPosition[];
  teamTwo: PlayerWithPosition[];
  onSwap: (newTeamOne: PlayerWithPosition[], newTeamTwo: PlayerWithPosition[]) => void;
}

export function usePlayerSwap({ teamOne, teamTwo, onSwap }: UsePlayerSwapProps) {
  const { addToast } = useAppStore();

  const swapPlayers = useCallback((swapData: PlayerSwapData) => {
    const { fromTeam, toTeam, fromIndex, toIndex, draggedPlayer, targetPlayer } = swapData;

    // Check if it's a same-team swap
    const isSameTeam = fromTeam === toTeam;
    const totalPlayers = teamOne.length + teamTwo.length;
    const is8v8 = totalPlayers === 16 && teamOne.length === 8 && teamTwo.length === 8;

    // Rule 1: Prevent same-team swaps unless it's 8v8
    if (isSameTeam && !is8v8) {
      addToast({
        title: "No se puede intercambiar",
        description: "No podés mover jugadores dentro del mismo equipo",
        variant: "destructive",
      });
      return;
    }

    // Create copies of the teams
    const newTeamOne = [...teamOne];
    const newTeamTwo = [...teamTwo];

    // Get references to the source and target arrays
    const sourceTeam = fromTeam === "teamOne" ? newTeamOne : newTeamTwo;
    const targetTeam = toTeam === "teamOne" ? newTeamOne : newTeamTwo;

    if (isSameTeam) {
      // Rule 2: 8v8 same-team reordering - swap positions
      const draggedWithTargetPosition = {
        ...draggedPlayer,
        position: targetPlayer.position,
      };
      const targetWithDraggedPosition = {
        ...targetPlayer,
        position: draggedPlayer.position,
      };

      sourceTeam[fromIndex] = targetWithDraggedPosition;
      sourceTeam[toIndex] = draggedWithTargetPosition;

      addToast({
        title: "¡Posiciones intercambiadas!",
        description: `${draggedPlayer.name.replace("🧤", "")} ahora es ${targetPlayer.position}, ${targetPlayer.name.replace("🧤", "")} ahora es ${draggedPlayer.position}`,
      });
    } else {
      // Rule 3: Cross-team swaps - players adopt the position of who they replace
      const draggedWithNewPosition = {
        ...draggedPlayer,
        position: targetPlayer.position,
      };
      const targetWithNewPosition = {
        ...targetPlayer,
        position: draggedPlayer.position,
      };

      sourceTeam[fromIndex] = targetWithNewPosition;
      targetTeam[toIndex] = draggedWithNewPosition;

      const positionChange1 = draggedPlayer.position !== targetPlayer.position 
        ? ` (ahora ${targetPlayer.position})` 
        : '';
      const positionChange2 = targetPlayer.position !== draggedPlayer.position 
        ? ` (ahora ${draggedPlayer.position})` 
        : '';

      addToast({
        title: "¡Intercambio exitoso!",
        description: `${draggedPlayer.name.replace("🧤", "")}${positionChange1} ↔️ ${targetPlayer.name.replace("🧤", "")}${positionChange2}`,
      });
    }

    // Sort teams by position for consistency
    const positionOrder = ["Arco", "Def", "Medio", "Del", "Jugador"];
    const comparePositions = (a: PlayerWithPosition, b: PlayerWithPosition) => {
      return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position);
    };

    newTeamOne.sort(comparePositions);
    newTeamTwo.sort(comparePositions);

    // Apply the changes
    onSwap(newTeamOne, newTeamTwo);
  }, [teamOne, teamTwo, onSwap, addToast]);

  const canSwap = useCallback((draggedPlayer: PlayerWithPosition, targetPlayer: PlayerWithPosition, draggedTeam?: "teamOne" | "teamTwo", targetTeam?: "teamOne" | "teamTwo"): boolean => {
    // Basic validation: can't swap with self
    if (draggedPlayer.name === targetPlayer.name) {
      return false;
    }

    // If team info is not provided, allow the swap (validation will happen in swapPlayers)
    if (!draggedTeam || !targetTeam) {
      return true;
    }

    // Check if it's a same-team swap
    const isSameTeam = draggedTeam === targetTeam;
    const totalPlayers = teamOne.length + teamTwo.length;
    const is8v8 = totalPlayers === 16 && teamOne.length === 8 && teamTwo.length === 8;

    // Allow same-team swaps only for 8v8
    if (isSameTeam && !is8v8) {
      return false;
    }

    return true;
  }, [teamOne, teamTwo]);

  const getPlayerTeamAndIndex = useCallback((playerId: string): { team: "teamOne" | "teamTwo"; index: number } | null => {
    // Find in team one
    const teamOneIndex = teamOne.findIndex(player => 
      `${player.name}-${player.position}` === playerId
    );
    if (teamOneIndex !== -1) {
      return { team: "teamOne", index: teamOneIndex };
    }

    // Find in team two
    const teamTwoIndex = teamTwo.findIndex(player => 
      `${player.name}-${player.position}` === playerId
    );
    if (teamTwoIndex !== -1) {
      return { team: "teamTwo", index: teamTwoIndex };
    }

    return null;
  }, [teamOne, teamTwo]);

  return {
    swapPlayers,
    canSwap,
    getPlayerTeamAndIndex,
  };
}
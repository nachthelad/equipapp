"use client";
import { useCallback } from "react";
import type { PlayerWithPosition } from "@/types";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const swapPlayers = useCallback((swapData: PlayerSwapData) => {
    const { fromTeam, toTeam, fromIndex, toIndex, draggedPlayer, targetPlayer } = swapData;

    // Create copies of the teams
    const newTeamOne = [...teamOne];
    const newTeamTwo = [...teamTwo];

    // Get references to the source and target arrays
    const sourceTeam = fromTeam === "teamOne" ? newTeamOne : newTeamTwo;
    const targetTeam = toTeam === "teamOne" ? newTeamOne : newTeamTwo;

    // Perform the swap
    if (fromTeam === toTeam) {
      // Swapping within the same team (reordering)
      sourceTeam[fromIndex] = targetPlayer;
      sourceTeam[toIndex] = draggedPlayer;
    } else {
      // Swapping between different teams
      sourceTeam[fromIndex] = targetPlayer;
      targetTeam[toIndex] = draggedPlayer;
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

    // Show success toast
    toast({
      title: "¡Intercambio exitoso!",
      description: `${draggedPlayer.name.replace("🧤", "")} ↔️ ${targetPlayer.name.replace("🧤", "")}`,
      duration: 2000,
    });
  }, [teamOne, teamTwo, onSwap, toast]);

  const canSwap = useCallback((draggedPlayer: PlayerWithPosition, targetPlayer: PlayerWithPosition): boolean => {
    // Allow swapping any player with any other player
    // No restrictions for now, but this could be extended to include position-based rules
    return draggedPlayer.name !== targetPlayer.name;
  }, []);

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
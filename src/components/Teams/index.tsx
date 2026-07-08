"use client";
import { useState, useCallback, memo, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { PlayerWithPosition } from "@/types";
import { motion } from "framer-motion";
import {
  formatTeamsForSharing,
  copyToClipboard,
  shareViaWhatsApp,
} from "@/utils/teamActions";
import { Shuffle, Copy, Send, Users, ArrowLeft } from "lucide-react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { usePlayerSwap, type PlayerSwapData } from "@/hooks/usePlayerSwap";
import { DraggablePlayerCard } from "./DraggablePlayerCard";
import { useTeamStore } from "@/store/teamStore";
import { useAppStore } from "@/store/appStore";

interface TeamsProps {
  onGoBack: () => void;
}

interface SelectedPlayer {
  player: PlayerWithPosition;
  team: "teamOne" | "teamTwo";
  index: number;
}

// Defined outside Teams so its reference is always stable — prevents re-mount flash
const TeamCard = memo(function TeamCard({
  team,
  teamName,
  teamKey,
  color,
  animIndex,
  selectedPlayer,
  onPlayerTap,
}: {
  team: PlayerWithPosition[];
  teamName: string;
  teamKey: "teamOne" | "teamTwo";
  color: string;
  animIndex: number;
  selectedPlayer: SelectedPlayer | null;
  onPlayerTap: (player: PlayerWithPosition, team: "teamOne" | "teamTwo", index: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animIndex * 0.1 }}
      className="team-card rounded-2xl p-1.5 shadow-md"
    >
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1.5">
        <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${color}`} />
        <h3 className="whitespace-nowrap text-[11px] sm:text-base md:text-lg font-bold text-gray-800">{teamName}</h3>
        <div className="flex items-center gap-1 text-gray-600">
          <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-xs">{team.length}</span>
        </div>
      </div>
      <div className="space-y-1">
        {team.map((player, playerIndex) => (
          <DraggablePlayerCard
            key={`${player.name}-${playerIndex}`}
            player={player}
            playerIndex={playerIndex}
            teamName={teamKey}
            isSelected={selectedPlayer?.team === teamKey && selectedPlayer?.index === playerIndex}
            isAnySelected={selectedPlayer !== null}
            onClick={() => onPlayerTap(player, teamKey, playerIndex)}
          />
        ))}
      </div>
    </motion.div>
  );
});

function Teams({ onGoBack }: TeamsProps) {
  const { teamsData, redistributeTeams, updateTeams } = useTeamStore();
  const { addToast } = useAppStore();
  const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(null);

  // Get teams from store
  const teams = useMemo(
    () =>
      teamsData
        ? {
            teamOne: teamsData.teamOne,
            teamTwo: teamsData.teamTwo,
          }
        : { teamOne: [], teamTwo: [] },
    [teamsData]
  );

  const handleRedistribute = useCallback(() => {
    setSelectedPlayer(null);
    redistributeTeams();
    addToast({
      title: "¡Equipos redistribuidos!",
      description: "Los equipos han sido reorganizados",
    });
  }, [redistributeTeams, addToast]);

  const handleCopyTeams = useCallback(async () => {
    try {
      const formattedText = formatTeamsForSharing(teams.teamOne, teams.teamTwo);
      await copyToClipboard(formattedText);
      addToast({
        title: "¡Copiado!",
        description: "Los equipos se copiaron al portapapeles",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  }, [teams, addToast]);

  const handleShareWhatsApp = useCallback(() => {
    const formattedText = formatTeamsForSharing(teams.teamOne, teams.teamTwo);
    shareViaWhatsApp(formattedText);
  }, [teams]);

  // Player swap functionality
  const handleTeamSwap = useCallback(
    (newTeamOne: PlayerWithPosition[], newTeamTwo: PlayerWithPosition[]) => {
      updateTeams(newTeamOne, newTeamTwo);
    },
    [updateTeams]
  );

  const { swapPlayers, canSwap } = usePlayerSwap({
    teamOne: teams.teamOne,
    teamTwo: teams.teamTwo,
    onSwap: handleTeamSwap,
  });

  // Tap-to-swap logic
  const handlePlayerTap = useCallback(
    (player: PlayerWithPosition, team: "teamOne" | "teamTwo", index: number) => {
      if (!selectedPlayer) {
        // First tap: select player
        setSelectedPlayer({ player, team, index });
        return;
      }

      // Tapping the same player deselects
      if (selectedPlayer.team === team && selectedPlayer.index === index) {
        setSelectedPlayer(null);
        return;
      }

      // Second tap: attempt swap
      const canDoSwap = canSwap(selectedPlayer.player, player, selectedPlayer.team, team);
      if (!canDoSwap) {
        addToast({
          title: "No se puede intercambiar",
          description: "No podés mover jugadores dentro del mismo equipo",
          variant: "destructive",
        });
        setSelectedPlayer(null);
        return;
      }

      const swapData: PlayerSwapData = {
        fromTeam: selectedPlayer.team,
        toTeam: team,
        fromIndex: selectedPlayer.index,
        toIndex: index,
        draggedPlayer: selectedPlayer.player,
        targetPlayer: player,
      };

      swapPlayers(swapData);
      setSelectedPlayer(null);
    },
    [selectedPlayer, canSwap, swapPlayers, addToast]
  );

  // Keyboard shortcuts for teams
  useKeyboardShortcuts([
    {
      key: "r",
      action: handleRedistribute,
      description: "Redistribuir equipos (R)",
    },
    {
      key: "c",
      action: handleCopyTeams,
      description: "Copiar equipos (C)",
    },
    {
      key: "w",
      action: handleShareWhatsApp,
      description: "Compartir por WhatsApp (W)",
    },
    {
      key: "Escape",
      action: () => setSelectedPlayer(null),
      description: "Cancelar selección (Esc)",
    },
  ]);

  // Redirect if no teams data
  useEffect(() => {
    if (!teamsData) {
      onGoBack();
    }
  }, [teamsData, onGoBack]);

  const teamsGrid = (
    <div className="grid grid-cols-2 gap-3 md:gap-6">
      <TeamCard
        team={teams.teamOne}
        teamName="EQUIPO NEGRO"
        teamKey="teamOne"
        color="bg-gray-800"
        animIndex={0}
        selectedPlayer={selectedPlayer}
        onPlayerTap={handlePlayerTap}
      />
      <TeamCard
        team={teams.teamTwo}
        teamName="EQUIPO BLANCO"
        teamKey="teamTwo"
        color="bg-gray-300"
        animIndex={1}
        selectedPlayer={selectedPlayer}
        onPlayerTap={handlePlayerTap}
      />
    </div>
  );

  if (!teamsData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto flex flex-col flex-1 min-h-0 w-full pb-4 space-y-4"
    >
      {/* Unified Header */}
      <div className="flex-shrink-0 pb-3 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="text-white hover:bg-white/10 flex items-center gap-2 p-2 h-9 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <h2 className="text-base font-bold text-white">Equipos</h2>
          <div className="text-white/60 text-xs font-semibold px-2 py-1 rounded bg-white/10">
            Paso 3/3
          </div>
        </div>
        <p className="text-white/60 text-xs text-center">
          {selectedPlayer
            ? `✅ ${selectedPlayer.player.name.replace("🧤", "").trim()} seleccionado — tocá otro jugador para intercambiar`
            : "👆 Tocá un jugador para intercambiarlo con otro"}
        </p>
      </div>

      {/* Teams — No scroll, fills available space */}
      <div className="flex-1 min-h-0">
        {teamsGrid}
      </div>

      {/* Action buttons — Always visible at the bottom */}
      <div className="flex-shrink-0 space-y-3 pt-3 border-t border-white/10">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyTeams}
            className="flex-1 h-11 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center justify-center gap-1.5 text-xs font-semibold px-2"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="truncate">Copiar</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleRedistribute}
            className="flex-1 h-11 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center justify-center gap-1.5 text-xs font-semibold px-2"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="truncate">Sortear</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onGoBack}
            className="flex-1 h-11 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center justify-center gap-1.5 text-xs font-semibold px-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="truncate">Inicio</span>
          </Button>
        </div>

        <Button
          type="button"
          onClick={handleShareWhatsApp}
          className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white border-green-600 font-semibold flex items-center justify-center gap-2 text-base"
        >
          <Send className="w-5 h-5" />
          Compartir por WhatsApp
        </Button>
      </div>
    </motion.div>
  );
}

export default memo(Teams);

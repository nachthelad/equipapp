"use client";
import { useState, useCallback, memo, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { PlayerWithPosition } from "@/types";
import { motion } from "framer-motion";
import {
  formatTeamsForSharing,
  copyToClipboard,
  shareViaWhatsApp,
} from "@/utils/teamActions";
import { Shuffle, Copy, Send, Users } from "lucide-react";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { usePlayerSwap, type PlayerSwapData } from "@/hooks/usePlayerSwap";
import { DraggablePlayerCard } from "./DraggablePlayerCard";
import { useTeamStore } from "@/store/teamStore";
import { useAppStore } from "@/store/appStore";

interface TeamsProps {
  onGoBack: () => void;
}

function Teams({ onGoBack }: TeamsProps) {
  const { teamsData, redistributeTeams, updateTeams } = useTeamStore();
  const { addToast } = useAppStore();
  const [activePlayer, setActivePlayer] = useState<PlayerWithPosition | null>(
    null
  );

  // Get teams from store
  const teams = teamsData ? {
    teamOne: teamsData.teamOne,
    teamTwo: teamsData.teamTwo,
  } : { teamOne: [], teamTwo: [] };

  const handleRedistribute = useCallback(() => {
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

  const { swapPlayers, canSwap, getPlayerTeamAndIndex } = usePlayerSwap({
    teamOne: teams.teamOne,
    teamTwo: teams.teamTwo,
    onSwap: handleTeamSwap,
  });

  // Configure sensors for better mobile support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms delay before activation
        tolerance: 8, // Allow 8px of tolerance during delay
      },
    })
  );

  // Drag and drop handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const player = active.data.current?.player as PlayerWithPosition;
    setActivePlayer(player);

    // Prevent body scrolling during drag on mobile
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActivePlayer(null);

      // Restore body scrolling after drag
      document.body.style.overflow = "";
      document.body.style.touchAction = "";

      if (!over) return;

      const draggedData = active.data.current;
      const droppedData = over.data.current;

      if (!draggedData || !droppedData) return;

      const draggedPlayer = draggedData.player as PlayerWithPosition;
      const targetPlayer = droppedData.player as PlayerWithPosition;

      // Don't swap with self
      if (draggedPlayer.name === targetPlayer.name) return;

      // Get player positions
      const draggedPos = getPlayerTeamAndIndex(
        `${draggedPlayer.name}-${draggedPlayer.position}`
      );
      const targetPos = getPlayerTeamAndIndex(
        `${targetPlayer.name}-${targetPlayer.position}`
      );

      if (!draggedPos || !targetPos) return;

      // Check if swap is allowed
      if (
        !canSwap(draggedPlayer, targetPlayer, draggedPos.team, targetPos.team)
      )
        return;

      // Create swap data
      const swapData: PlayerSwapData = {
        fromTeam: draggedPos.team,
        toTeam: targetPos.team,
        fromIndex: draggedPos.index,
        toIndex: targetPos.index,
        draggedPlayer,
        targetPlayer,
      };

      swapPlayers(swapData);
    },
    [canSwap, getPlayerTeamAndIndex, swapPlayers]
  );

  // Cleanup effect to restore scrolling if component unmounts during drag
  useEffect(() => {
    return () => {
      // Restore scrolling on cleanup
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

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
  ]);

  const TeamCard = useMemo(() => {
    return memo(
      ({
        team,
        teamName,
        color,
        index,
      }: {
        team: PlayerWithPosition[];
        teamName: string;
        color: string;
        index: number;
      }) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="team-card rounded-2xl p-3 shadow-xl"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`w-4 h-4 rounded-full ${color}`} />
            <h3 className="text-xl font-bold text-gray-800">{teamName}</h3>
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm">{team.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            {team.map((player, playerIndex) => (
              <DraggablePlayerCard
                key={`${player.name}-${playerIndex}`}
                player={player}
                playerIndex={playerIndex}
                teamName={teamName === "EQUIPO NEGRO" ? "teamOne" : "teamTwo"}
              />
            ))}
          </div>
        </motion.div>
      )
    );
  }, []);

  const memoizedTeams = useMemo(
    () => (
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <TeamCard
          team={teams.teamOne}
          teamName="EQUIPO NEGRO"
          color="bg-gray-800"
          index={0}
        />
        <TeamCard
          team={teams.teamTwo}
          teamName="EQUIPO BLANCO"
          color="bg-gray-300"
          index={1}
        />
      </div>
    ),
    [teams.teamOne, teams.teamTwo]
  );

  // If no teams data, redirect back (after all hooks)
  useEffect(() => {
    if (!teamsData) {
      onGoBack();
    }
  }, [teamsData, onGoBack]);

  if (!teamsData) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6 pb-20"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            ¡Equipos listos!
          </h2>
          <p className="text-white/60 text-sm text-center max-w-md mx-auto">
            📱 Mantené presionado un jugador para arrastrarlo
            {teams.teamOne.length === 8 && teams.teamTwo.length === 8 ? (
              <span className="block">
                • Entre equipos: intercambia equipos y posiciones
              </span>
            ) : null}
            {teams.teamOne.length === 8 && teams.teamTwo.length === 8 ? (
              <span className="block">
                • Mismo equipo: intercambia solo posiciones
              </span>
            ) : (
              <span className="block">• Solo entre equipos diferentes</span>
            )}
          </p>
        </div>

        {/* Teams */}
        {memoizedTeams}

        {/* Back button */}
        <div className="text-center pt-4">
          <Button
            onClick={onGoBack}
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Crear nuevos equipos
          </Button>
        </div>
      </motion.div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activePlayer ? (
          <DraggablePlayerCard
            player={activePlayer}
            playerIndex={0}
            teamName="teamOne"
            isDragOverlay={true}
          />
        ) : null}
      </DragOverlay>

      <BottomNavigation
        leftButton={{
          icon: <Copy className="w-4 h-4" />,
          label: "Copiar",
          action: handleCopyTeams,
        }}
        centerButton={{
          icon: <Shuffle className="w-4 h-4" />,
          label: "Volver a sortear",
          action: handleRedistribute,
        }}
        rightButton={{
          icon: <Send className="w-4 h-4" />,
          label: "WhatsApp",
          action: handleShareWhatsApp,
          className:
            "bg-green-600 hover:bg-green-700 text-white border-green-600",
        }}
      />
    </DndContext>
  );
}

export default memo(Teams);

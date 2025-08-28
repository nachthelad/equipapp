"use client";
import { useState, useCallback, memo, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { PlayerWithPosition } from "@/types";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  formatTeamsForSharing,
  copyToClipboard,
  shareViaWhatsApp,
} from "@/utils/teamActions";
import { Shuffle, Copy, Send, Trophy, Users } from "lucide-react";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { shuffle } from "lodash";
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

interface TeamsProps {
  teamOne: PlayerWithPosition[];
  teamTwo: PlayerWithPosition[];
  onGoBack: () => void;
}

function Teams({
  teamOne: initialTeamOne,
  teamTwo: initialTeamTwo,
  onGoBack,
}: TeamsProps) {
  const { toast } = useToast();
  const [teams, setTeams] = useState({
    teamOne: initialTeamOne,
    teamTwo: initialTeamTwo,
  });
  const [activePlayer, setActivePlayer] = useState<PlayerWithPosition | null>(
    null
  );

  // Use ref to track if this is the first render
  const isFirstRender = useRef(true);

  // Only update on first render or when props actually change
  if (isFirstRender.current) {
    setTeams({
      teamOne: initialTeamOne,
      teamTwo: initialTeamTwo,
    });
    isFirstRender.current = false;
  }

  const handleRedistribute = useCallback(() => {
    // Redistribuir los equipos usando los props originales para evitar re-renders
    const allPlayers = [...initialTeamOne, ...initialTeamTwo];

    // Use lodash shuffle for better randomization
    const shuffledPlayers = shuffle([...allPlayers]);

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

    const newTeamOne: PlayerWithPosition[] = [];
    const newTeamTwo: PlayerWithPosition[] = [];

    const allPlayersOrdered = [
      ...goalkeepers,
      ...defenders,
      ...midfielders,
      ...forwards,
      ...players,
    ];
    allPlayersOrdered.forEach((player, index) => {
      if (index % 2 === 0) newTeamOne.push(player);
      else newTeamTwo.push(player);
    });

    newTeamOne.sort(comparePositions);
    newTeamTwo.sort(comparePositions);

    // Update state in a single batch to prevent multiple re-renders
    setTeams({
      teamOne: newTeamOne,
      teamTwo: newTeamTwo,
    });

    // Show toast immediately
    toast({
      title: "¡Equipos redistribuidos!",
      description: "Los equipos han sido reorganizados",
    });
  }, [initialTeamOne, initialTeamTwo, toast]);

  const handleCopyTeams = useCallback(async () => {
    try {
      const formattedText = formatTeamsForSharing(teams.teamOne, teams.teamTwo);
      await copyToClipboard(formattedText);
      toast({
        title: "¡Copiado!",
        description: "Los equipos se copiaron al portapapeles",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    }
  }, [teams, toast]);

  const handleShareWhatsApp = useCallback(() => {
    const formattedText = formatTeamsForSharing(teams.teamOne, teams.teamTwo);
    shareViaWhatsApp(formattedText);
  }, [teams]);

  // Player swap functionality
  const handleTeamSwap = useCallback(
    (newTeamOne: PlayerWithPosition[], newTeamTwo: PlayerWithPosition[]) => {
      setTeams({
        teamOne: newTeamOne,
        teamTwo: newTeamTwo,
      });
    },
    []
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

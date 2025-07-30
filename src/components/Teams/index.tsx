"use client";
import { useState, useCallback, memo, useRef, useMemo } from "react";
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
import { shuffle } from "lodash";

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
          className="team-card rounded-2xl p-6 shadow-xl"
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
              <motion.div
                key={`${player.name}-${playerIndex}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + playerIndex * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-800">
                  {player.name.replace("🧤", "")}
                </span>
                {player.position !== "Jugador" && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      player.position === "Arco"
                        ? "bg-yellow-100 text-yellow-800"
                        : player.position === "Def"
                        ? "bg-blue-100 text-blue-800"
                        : player.position === "Medio"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {player.position}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )
    );
  }, []);

  const memoizedTeams = useMemo(
    () => (
      <div className="grid md:grid-cols-2 gap-6">
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">¡Equipos listos!</h2>
        <p className="text-white/70">
          Los equipos están balanceados y listos para jugar
        </p>
      </div>

      {/* Teams */}
      {memoizedTeams}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleRedistribute}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Volver a sortear
        </Button>

        <Button
          onClick={handleCopyTeams}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copiar
        </Button>

        <Button
          onClick={handleShareWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar por WhatsApp
        </Button>
      </div>

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
  );
}

export default memo(Teams);

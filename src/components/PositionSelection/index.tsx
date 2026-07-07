"use client";
import { useState } from "react";
import type {
  PlayerWithPosition,
  PlayerPosition,
  PositionSelectionProps,
} from "@/types";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  validatePositions,
  getPositionCounts,
  generateBalancedTeamsFromPositions,
} from "@/utils/positionValidation";
import { Shield, Target, Zap, ArrowRight, ArrowLeft, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";

const positionIcons: Record<PlayerPosition, React.ReactElement> = {
  Arco: <CircleDot className="w-4 h-4" />,
  Def: <Shield className="w-4 h-4" />,
  Medio: <Target className="w-4 h-4" />,
  Del: <Zap className="w-4 h-4" />,
  Jugador: <Shield className="w-4 h-4" />,
};

const positionColors: Record<PlayerPosition, { active: string; inactive: string }> = {
  Arco:   { active: "bg-yellow-500 text-white border-yellow-500",   inactive: "bg-white/5 text-white/50 border-white/10 hover:bg-white/15 hover:text-white/80" },
  Def:    { active: "bg-blue-500 text-white border-blue-500",       inactive: "bg-white/5 text-white/50 border-white/10 hover:bg-white/15 hover:text-white/80" },
  Medio:  { active: "bg-green-500 text-white border-green-500",     inactive: "bg-white/5 text-white/50 border-white/10 hover:bg-white/15 hover:text-white/80" },
  Del:    { active: "bg-red-500 text-white border-red-500",         inactive: "bg-white/5 text-white/50 border-white/10 hover:bg-white/15 hover:text-white/80" },
  Jugador:{ active: "bg-gray-500 text-white border-gray-500",       inactive: "bg-white/5 text-white/50 border-white/10 hover:bg-white/15 hover:text-white/80" },
};

const POSITIONS: PlayerPosition[] = ["Arco", "Def", "Medio", "Del"];

export default function PositionSelection({
  playerNames,
  onPositionSelection,
  onGoBack,
}: PositionSelectionProps) {
  const { toast } = useToast();
  const [playersWithPositions, setPlayersWithPositions] = useState<
    PlayerWithPosition[]
  >(
    playerNames.map((name) => ({
      name,
      position: name.includes("🧤") ? "Arco" : "Medio",
    }))
  );

  const handlePositionChange = (index: number, position: PlayerPosition) => {
    const updated = [...playersWithPositions];
    updated[index].position = position;
    setPlayersWithPositions(updated);
  };

  const validateAndProceed = () => {
    const validation = validatePositions(playersWithPositions);
    if (!validation.isValid) {
      toast({
        title: "Error",
        description: validation.errors[0],
        variant: "destructive",
      });
      return;
    }
    const { teamOne, teamTwo } =
      generateBalancedTeamsFromPositions(playersWithPositions);
    onPositionSelection({ teamOne, teamTwo });
  };

  const positionCounts = getPositionCounts(playersWithPositions);
  const isReady = positionCounts.Arco === 2 && positionCounts.Def === 6;

  return (
    <div className="max-w-lg mx-auto flex flex-col flex-1 min-h-0 w-full pb-4">
      {/* Header + counters (always at the top, uses default app background) */}
      <div className="flex-shrink-0 pb-3 border-b border-white/10 space-y-3">
        {/* Navigation & Title row */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="text-white hover:bg-white/10 flex items-center gap-2 p-2 h-9 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <h2 className="text-base font-bold text-white">Posiciones</h2>
          <div className="text-white/60 text-xs font-semibold px-2 py-1 rounded bg-white/10">
            Paso 2/3
          </div>
        </div>

        {/* Position summary pills */}
        <div className="flex justify-center gap-2 flex-wrap">
          {POSITIONS.map((pos) => {
            const count = positionCounts[pos];
            const target = pos === "Arco" ? 2 : pos === "Def" ? 6 : null;
            const isOk = target !== null && count === target;
            return (
              <div
                key={pos}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                  isOk
                    ? "bg-green-500/20 border-green-500/40 text-green-300"
                    : "bg-white/5 border-white/15 text-white/60"
                }`}
              >
                {positionIcons[pos]}
                <span>{pos}</span>
                <span className="font-bold">
                  {count}{target !== null ? `/${target}` : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Player rows — Scrolls internally */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-y-auto min-h-0 space-y-2 py-3 pr-1"
      >
        {playersWithPositions.map((player, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="flex items-center gap-3 rounded-xl bg-white/8 border border-white/10 px-4 py-2.5"
          >
            {/* Name */}
            <span className="flex-1 text-sm font-medium text-white truncate">
              {player.name.replace("🧤", "").trim()}
            </span>

            {/* Position buttons */}
            <div className="flex gap-1.5 flex-shrink-0">
              {POSITIONS.map((pos) => {
                const isActive = player.position === pos;
                const colors = positionColors[pos];
                return (
                  <motion.button
                    key={pos}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePositionChange(index, pos)}
                    className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all duration-150 ${
                      isActive ? colors.active : colors.inactive
                    }`}
                    title={pos}
                  >
                    {positionIcons[pos]}
                    <span className="hidden sm:inline">{pos}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Confirm button */}
      <div className="flex-shrink-0 pt-3 border-t border-white/5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={validateAndProceed}
          disabled={!isReady}
          className="w-full h-12 rounded-xl bg-white text-purple-700 font-semibold hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base transition-opacity"
        >
          <ArrowRight className="w-5 h-5" />
          Generar equipos
        </motion.button>
      </div>
    </div>
  );
}

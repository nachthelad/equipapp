"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Shield, Target, Zap, ArrowRight } from "lucide-react";
import { BottomNavigation } from "@/components/ui/BottomNavigation";

const positionIcons: Record<PlayerPosition, string | React.ReactElement> = {
  Arco: "🧤",
  Def: <Shield className="w-4 h-4" />,
  Medio: <Target className="w-4 h-4" />,
  Del: <Zap className="w-4 h-4" />,
  Jugador: "👤",
};

const positionColors: Record<PlayerPosition, string> = {
  Arco: "bg-yellow-500 hover:bg-yellow-600",
  Def: "bg-blue-500 hover:bg-blue-600",
  Medio: "bg-green-500 hover:bg-green-600",
  Del: "bg-red-500 hover:bg-red-600",
  Jugador: "bg-gray-500 hover:bg-gray-600",
};

export default function PositionSelection({
  playerNames,
  onPositionSelection,
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
    const newPlayersWithPositions = [...playersWithPositions];
    newPlayersWithPositions[index].position = position;
    setPlayersWithPositions(newPlayersWithPositions);
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

    // Solo pasamos los datos al componente padre
    onPositionSelection({ teamOne, teamTwo });
  };

  const positionCounts = getPositionCounts(playersWithPositions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto pb-20"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Seleccioná las posiciones
        </h2>
        <p className="text-white/70">Necesitás 2 arqueros y 6 defensores</p>
      </div>

      {/* Position counters */}
      <div className="grid grid-cols-4 gap-3 mb-8 p-4 bg-white/10 backdrop-blur-md rounded-xl">
        {(["Arco", "Def", "Medio", "Del"] as PlayerPosition[]).map(
          (position) => (
            <div key={position} className="text-center">
              <div
                className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center text-white ${
                  position === "Arco"
                    ? "bg-yellow-500"
                    : position === "Def"
                    ? "bg-blue-500"
                    : position === "Medio"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {typeof positionIcons[position] === "string"
                  ? positionIcons[position]
                  : positionIcons[position]}
              </div>
              <div className="text-white text-sm font-medium">{position}</div>
              <div
                className={`text-sm font-bold ${
                  (position === "Arco" && positionCounts[position] === 2) ||
                  (position === "Def" && positionCounts[position] === 6)
                    ? "text-green-300"
                    : "text-white/70"
                }`}
              >
                {positionCounts[position]}
                {position === "Arco" && "/2"}
                {position === "Def" && "/6"}
              </div>
            </div>
          )
        )}
      </div>

      {/* Players list - No card wrapper */}
      <div className="space-y-4 overflow-y-auto">
        {playersWithPositions.map((player, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-5"
          >
            <div className="text-white font-semibold mb-4 text-center text-lg">
              {player.name.replace("🧤", "")}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {(["Arco", "Def", "Medio", "Del"] as PlayerPosition[]).map(
                (position) => (
                  <motion.button
                    key={position}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-xl text-white font-medium transition-all duration-200 flex flex-col items-center gap-2 min-h-[80px] ${
                      player.position === position
                        ? positionColors[position]
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                    onClick={() => handlePositionChange(index, position)}
                  >
                    <div className="text-xl">
                      {typeof positionIcons[position] === "string"
                        ? positionIcons[position]
                        : positionIcons[position]}
                    </div>
                    <span className="text-sm">{position}</span>
                  </motion.button>
                )
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <BottomNavigation
        centerButton={{
          icon: <ArrowRight className="w-4 h-4" />,
          label: "Generar equipos",
          action: validateAndProceed,
          disabled: positionCounts.Arco !== 2 || positionCounts.Def !== 6,
        }}
      />
    </motion.div>
  );
}

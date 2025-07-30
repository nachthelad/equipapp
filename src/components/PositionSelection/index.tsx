"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { PlayerWithPosition, PlayerPosition, PositionSelectionProps } from "@/types"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { validatePositions, getPositionCounts, generateBalancedTeamsFromPositions } from "@/utils/positionValidation"
import { Shield, Target, Zap, ArrowRight } from "lucide-react"

const positionIcons = {
  Arco: "🧤",
  Def: <Shield className="w-4 h-4" />,
  Medio: <Target className="w-4 h-4" />,
  Del: <Zap className="w-4 h-4" />,
}

const positionColors = {
  Arco: "bg-yellow-500 hover:bg-yellow-600",
  Def: "bg-blue-500 hover:bg-blue-600",
  Medio: "bg-green-500 hover:bg-green-600",
  Del: "bg-red-500 hover:bg-red-600",
}

export default function PositionSelection({ playerNames, onPositionSelection, onGoBack }: PositionSelectionProps) {
  const { toast } = useToast()
  const [playersWithPositions, setPlayersWithPositions] = useState<PlayerWithPosition[]>(
    playerNames.map((name) => ({
      name,
      position: name.includes("🧤") ? "Arco" : "Medio",
    })),
  )

  const handlePositionChange = (index: number, position: PlayerPosition) => {
    const newPlayersWithPositions = [...playersWithPositions]
    newPlayersWithPositions[index].position = position
    setPlayersWithPositions(newPlayersWithPositions)
  }

  const validateAndProceed = () => {
    const validation = validatePositions(playersWithPositions)

    if (!validation.isValid) {
      toast({
        title: "Error",
        description: validation.errors[0],
        variant: "destructive",
      })
      return
    }

    const { teamOne, teamTwo } = generateBalancedTeamsFromPositions(playersWithPositions)

    // Solo pasamos los datos al componente padre
    onPositionSelection({ teamOne, teamTwo })
  }

  const positionCounts = getPositionCounts(playersWithPositions)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="glass rounded-2xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Seleccioná las posiciones</h2>
          <p className="text-white/70 text-sm">Necesitás 2 arqueros y 6 defensores</p>
        </div>

        {/* Position counters */}
        <div className="grid grid-cols-4 gap-2 mb-6 p-4 bg-white/10 rounded-xl">
          {(["Arco", "Def", "Medio", "Del"] as PlayerPosition[]).map((position) => (
            <div key={position} className="text-center">
              <div
                className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center text-white text-sm ${
                  position === "Arco"
                    ? "bg-yellow-500"
                    : position === "Def"
                      ? "bg-blue-500"
                      : position === "Medio"
                        ? "bg-green-500"
                        : "bg-red-500"
                }`}
              >
                {typeof positionIcons[position] === "string" ? positionIcons[position] : positionIcons[position]}
              </div>
              <div className="text-white text-xs font-medium">{position}</div>
              <div
                className={`text-xs font-bold ${
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
          ))}
        </div>

        {/* Players list */}
        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {playersWithPositions.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/10 rounded-xl p-4"
            >
              <div className="text-white font-medium mb-3 text-center">{player.name.replace("🧤", "")}</div>
              <div className="grid grid-cols-4 gap-2">
                {(["Arco", "Def", "Medio", "Del"] as PlayerPosition[]).map((position) => (
                  <motion.button
                    key={position}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg text-white font-medium text-sm transition-all duration-200 flex flex-col items-center gap-1 ${
                      player.position === position ? positionColors[position] : "bg-white/20 hover:bg-white/30"
                    }`}
                    onClick={() => handlePositionChange(index, position)}
                  >
                    <div className="text-lg">
                      {typeof positionIcons[position] === "string" ? positionIcons[position] : positionIcons[position]}
                    </div>
                    <span>{position}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={validateAndProceed}
          className="w-full bg-white text-purple-700 hover:bg-white/90 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          disabled={positionCounts.Arco !== 2 || positionCounts.Def !== 6}
        >
          Generar equipos
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}

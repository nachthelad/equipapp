"use client";
import { memo } from "react";
import type { PlayerWithPosition } from "@/types";
import { Shield, Target, Zap, CircleDot } from "lucide-react";

interface DraggablePlayerCardProps {
  player: PlayerWithPosition;
  playerIndex: number;
  teamName: "teamOne" | "teamTwo";
  isSelected?: boolean;
  isAnySelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const positionIcons: Record<string, React.ReactElement> = {
  Arco: <CircleDot className="w-3.5 h-3.5" />,
  Def: <Shield className="w-3.5 h-3.5" />,
  Medio: <Target className="w-3.5 h-3.5" />,
  Del: <Zap className="w-3.5 h-3.5" />,
  Jugador: <Shield className="w-3.5 h-3.5" />,
};

export const DraggablePlayerCard = memo(function DraggablePlayerCard({
  player,
  isSelected = false,
  isAnySelected = false,
  onClick,
  className = "",
}: DraggablePlayerCardProps) {
  const positionColors = {
    Arco: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Def: "bg-blue-100 text-blue-800 border-blue-200",
    Medio: "bg-green-100 text-green-800 border-green-200",
    Del: "bg-red-100 text-red-800 border-red-200",
    Jugador: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative flex items-center justify-between p-1 md:p-2 rounded-lg 
        transition-all duration-150 cursor-pointer touch-manipulation w-full select-none
        border-2
        ${
          isSelected
            ? "bg-purple-50/90 border-purple-500 shadow-md ring-2 ring-purple-500/20 scale-[1.02]"
            : isAnySelected
            ? "bg-gray-50 border-transparent opacity-60 hover:opacity-100 hover:bg-gray-100"
            : "bg-gray-50 border-transparent hover:bg-gray-100 hover:scale-[1.01]"
        }
        active:scale-95
        ${className}
      `}
    >
      {/* Selector dot indicator */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isSelected ? "bg-purple-500 animate-ping" : "bg-transparent"}`} />
        <span className="font-semibold text-gray-800 truncate text-xs md:text-sm">
          {player.name.replace("🧤", "")}
        </span>
      </div>

      {player.position !== "Jugador" && (
        <span
          className={`p-1.5 rounded-full border flex items-center justify-center flex-shrink-0 ${
            positionColors[player.position]
          }`}
          title={player.position}
        >
          {positionIcons[player.position]}
        </span>
      )}
    </div>
  );
});

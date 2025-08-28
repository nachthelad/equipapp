"use client";
import { memo } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import type { PlayerWithPosition } from "@/types";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";

interface DraggablePlayerCardProps {
  player: PlayerWithPosition;
  playerIndex: number;
  teamName: "teamOne" | "teamTwo";
  isDragOverlay?: boolean;
  className?: string;
}

export const DraggablePlayerCard = memo(function DraggablePlayerCard({
  player,
  playerIndex,
  teamName,
  isDragOverlay = false,
  className = "",
}: DraggablePlayerCardProps) {
  const playerId = `${player.name}-${player.position}`;
  const dropId = `${teamName}-${playerIndex}`;

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: playerId,
    data: {
      type: "player",
      player,
      playerIndex,
      teamName,
    },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: dropId,
    data: {
      type: "player-slot",
      player,
      playerIndex,
      teamName,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const positionColors = {
    Arco: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Def: "bg-blue-100 text-blue-800 border-blue-200",
    Medio: "bg-green-100 text-green-800 border-green-200",
    Del: "bg-red-100 text-red-800 border-red-200",
    Jugador: "bg-gray-100 text-gray-800 border-gray-200",
  };

  // Combine refs
  const setNodeRef = (element: HTMLElement | null) => {
    setDraggableRef(element);
    setDroppableRef(element);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: playerIndex * 0.05 }}
      className={`
        group relative flex items-center justify-between p-2 md:p-3 rounded-lg 
        transition-all duration-200 cursor-move touch-manipulation w-full
        ${
          isOver && !isDragging
            ? "bg-blue-50 border-2 border-blue-300 border-dashed"
            : "bg-gray-50 border-2 border-transparent"
        }
        ${isDragging ? "opacity-50 shadow-lg scale-105" : ""}
        ${
          isDragOverlay
            ? "shadow-2xl rotate-2 scale-110 bg-white border-blue-300"
            : ""
        }
        ${className}
      `}
      {...attributes}
      {...listeners}
      onTouchStart={(e) => {
        // Prevent scrolling when starting a drag on mobile
        if (listeners?.onTouchStart) {
          e.preventDefault();
        }
      }}
    >
      {/* Drag handle */}
      <div className="opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 touch:opacity-100 transition-opacity duration-200 mr-2">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Player info */}
      <div className="flex-1 flex items-center justify-between">
        <span className="font-medium text-gray-800 truncate text-xs md:text-sm">
          {player.name.replace("🧤", "")}
        </span>

        {player.position !== "Jugador" && (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${
              positionColors[player.position]
            }`}
          >
            {player.position}
          </span>
        )}
      </div>

      {/* Visual feedback for drag state */}
      {isOver && !isDragging && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-blue-100/70 rounded-lg flex items-center justify-center backdrop-blur-sm"
        >
          <div className="text-blue-700 text-xs font-semibold text-center px-2">
            Soltar para intercambiar
            {player.position !== "Jugador" && (
              <div className="text-blue-600 text-xs opacity-80">
                Adoptará posición: {player.position}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Drag overlay indicator */}
      {isDragOverlay && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      )}
    </motion.div>
  );
});

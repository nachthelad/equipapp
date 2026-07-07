"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlayerCounter } from "@/components/ui/PlayerCounter";
import InfoDialog from "./InfoDialog";
import type { PlayerFormProps } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  parsePlayerInput,
  validatePlayerCount,
  validateDuplicateNames,
} from "@/utils/playerValidation";
import { HelpCircle, ArrowRight, Clipboard, X } from "lucide-react";
import { motion } from "framer-motion";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { UpdateButton } from "@/components/ui/UpdateButton";
import { DonationButton } from "@/components/ui/DonationButton";
import { pasteFromClipboard } from "@/utils/teamActions";
import { useManualUpdate } from "@/hooks/useManualUpdate";

export default function PlayerForm({ onFormSubmit }: PlayerFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      players: "",
    },
  });

  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  const { currentVersion } = useManualUpdate();
  const watchedPlayers = watch("players");
  const playerCount = parsePlayerInput(watchedPlayers).length;

  useEffect(() => {
    if (errors.players) {
      toast({
        title: "Error",
        description: errors.players.message ?? "",
        variant: "destructive",
      });
    }
  }, [errors.players, toast]);

  const onSubmit = (data: { players: string }) => {
    const rawLines = data.players
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");
    const cleanedLines = parsePlayerInput(data.players);

    // Detect lines that became empty after cleaning (e.g. only emoji or symbols)
    if (cleanedLines.length < rawLines.length) {
      const diff = rawLines.length - cleanedLines.length;
      toast({
        title: "Nombre incompleto",
        description: `Hay ${diff} línea${diff > 1 ? 's' : ''} con nombre inválido (solo emoji o símbolo sin nombre). Completá el nombre o eliminá la línea.`,
        variant: "destructive",
      });
      return;
    }

    // Validate player count first
    const countValidation = validatePlayerCount(cleanedLines.length);
    if (!countValidation.isValid) {
      setError("players", {
        type: "manual",
        message: countValidation.message,
      });
      return;
    }

    // Validate duplicates
    const duplicateValidation = validateDuplicateNames(cleanedLines);
    if (!duplicateValidation.isValid) {
      setError("players", {
        type: "manual",
        message: duplicateValidation.message,
      });
      return;
    }

    onFormSubmit(cleanedLines);
  };

  const handlePaste = async () => {
    try {
      const text = await pasteFromClipboard();
      setValue("players", text);
      toast({
        title: "¡Pegado exitoso!",
        description: "Los jugadores se agregaron desde el portapapeles",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo pegar desde el portapapeles",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setValue("players", "");
    toast({
      title: "Lista limpiada",
      description: "La lista de jugadores ha sido borrada",
    });
  };

  // Keyboard shortcuts for form
  useKeyboardShortcuts([
    {
      key: "Enter",
      ctrlKey: true,
      action: () => {
        if (playerCount > 0) {
          handleSubmit(onSubmit)();
        }
      },
      description: "Enviar formulario (Ctrl+Enter)",
    },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-[430px] flex flex-col flex-1 min-h-0"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            Ingresá los nombres
          </h2>
          <p className="mt-3 text-sm font-medium text-white/75">
            Un nombre por línea
          </p>
        </div>

        {/* Scrollable area: label + textarea */}
        <div className="flex flex-col flex-1 min-h-0 gap-3">
          {/* Label row */}
          <div className="flex items-center justify-between flex-shrink-0">
            <Label htmlFor="players" className="font-semibold text-white">
              Lista de jugadores
            </Label>
            <div className="flex items-center gap-2">
              <UpdateButton />
              <DonationButton />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpenDialog(true)}
                className="p-2 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Textarea — scrolls internally */}
          <div className="relative flex-1 min-h-0">
            <textarea
              id="players"
              className="w-full h-full resize-none rounded-xl border border-white/25 bg-white/10 p-3 text-base leading-6 text-white placeholder:text-white/40 outline-none transition-colors focus:border-white/45 focus:bg-white/15 overflow-y-auto"
              {...register("players", {
                required: "Ingresá al menos un jugador",
              })}
            />
            {!watchedPlayers && (
              <div className="pointer-events-none absolute left-3 top-3 select-none text-base leading-6 text-white/30">
                <div>Juan Pérez</div>
                <div>Diego García 🧤</div>
                <div>Carlos López</div>
                <div>...</div>
              </div>
            )}
          </div>
        </div>

        {/* Always-visible bottom section */}
        <div className="flex-shrink-0 space-y-3 pb-4">
          {/* Pegar / Vaciar buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePaste}
              className="flex-1 h-11 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Clipboard className="w-4 h-4" />
              Pegar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={playerCount === 0}
              className="flex-1 h-11 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-40 flex items-center justify-center gap-2 text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Vaciar
            </Button>
          </div>

          {/* Info row: jugadores · versión · estado */}
          <PlayerCounter count={playerCount} version={currentVersion} />

          {/* Armar equipos */}
          <Button
            type="submit"
            disabled={playerCount === 0}
            className="w-full h-12 rounded-xl bg-white text-purple-700 font-semibold hover:bg-white/90 disabled:opacity-40 flex items-center justify-center gap-2 text-base"
          >
            <ArrowRight className="w-5 h-5" />
            Armar equipos
          </Button>
        </div>
      </form>

      <InfoDialog open={openDialog} handleClose={() => setOpenDialog(false)} />
    </motion.div>
  );
}

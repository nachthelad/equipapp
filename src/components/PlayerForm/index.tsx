"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Users, HelpCircle, ArrowRight, Clipboard, X } from "lucide-react";
import { motion } from "framer-motion";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { UpdateButton } from "@/components/ui/UpdateButton";
import { DonationButton } from "@/components/ui/DonationButton";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { pasteFromClipboard } from "@/utils/teamActions";

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
  const watchedPlayers = watch("players");
  const playerCount = watchedPlayers
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "").length;

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
    const cleanedLines = parsePlayerInput(data.players);
    
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
      className="max-w-md mx-auto pb-20"
    >
      <div className="glass rounded-2xl p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Ingresá los jugadores
            </h2>
            <p className="text-white/70 text-sm">Un nombre por línea</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="players" className="text-white font-medium">
                Lista de jugadores
              </Label>
              <div className="flex items-center gap-1">
                <UpdateButton />
                <DonationButton />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenDialog(true)}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <Textarea
                id="players"
                className="min-h-[160px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:bg-white/15 resize-none"
                {...register("players", {
                  required: "Ingresá al menos un jugador",
                })}
              />
              {!watchedPlayers && (
                <div className="absolute top-3 left-3 text-white/30 pointer-events-none select-none">
                  <div>Juan Pérez</div>
                  <div>Diego García 🧤</div>
                  <div>Carlos López</div>
                  <div>...</div>
                </div>
              )}
            </div>

            <PlayerCounter count={playerCount} />
          </div>

        </form>
      </div>

      <InfoDialog open={openDialog} handleClose={() => setOpenDialog(false)} />
      
      <BottomNavigation
        leftButton={{
          icon: <Clipboard className="w-4 h-4" />,
          label: "Pegar",
          action: handlePaste,
        }}
        centerButton={{
          icon: <ArrowRight className="w-4 h-4" />,
          label: "Crear equipos",
          action: () => {
            if (playerCount > 0) {
              handleSubmit(onSubmit)();
            }
          },
          disabled: playerCount === 0,
        }}
        rightButton={{
          icon: <X className="w-4 h-4" />,
          label: "Limpiar",
          action: handleClear,
          disabled: playerCount === 0,
        }}
      />
    </motion.div>
  );
}

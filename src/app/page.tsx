"use client";
import { lazy, Suspense, useCallback, useMemo } from "react";
import Image from "next/image";
import type { TeamsData } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigation } from "@/hooks/useNavigation";
import { useTeamGeneration } from "@/hooks/useTeamGeneration";
import { useKeyboardShortcuts, useGlobalKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTeamStore } from "@/store/teamStore";
import { useAppStore } from "@/store/appStore";
import { validateGoalkeepers } from "@/utils/playerValidation";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { HydrationProvider } from "@/components/HydrationProvider";
import { PlayerFormSkeleton } from "@/components/ui/PlayerFormSkeleton";
import { PositionSelectionSkeleton } from "@/components/ui/PositionSelectionSkeleton";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Lazy loading de componentes
const PlayerForm = lazy(() => import("@/components/PlayerForm"));
const PositionSelection = lazy(() => import("@/components/PositionSelection"));
// Import Teams directly to prevent re-rendering issues
import Teams from "@/components/Teams";

// Force dynamic rendering to avoid SSR issues with Zustand
export const dynamic = 'force-dynamic';

export default function Home() {
  const { players, setPlayers, setTeamsData, resetTeams } = useTeamStore();
  const { addToast } = useAppStore();
  const { step, goToStep, goToStart } = useNavigation();
  const {
    generateSimpleTeams,
    setTeamOne,
    setTeamTwo,
  } = useTeamGeneration();

  const handleFormSubmit = useCallback(
    (names: string[]) => {
      setPlayers(names);

      const goalkeeperValidation = validateGoalkeepers(names);
      if (!goalkeeperValidation.isValid) {
        addToast({
          title: "Error",
          description: goalkeeperValidation.message,
          variant: "destructive",
        });
        return;
      }

      if (names.length !== 16) {
        const generatedTeams = generateSimpleTeams(names);
        setTeamsData(generatedTeams);
        goToStep(3);
      } else {
        goToStep(2);
      }
    },
    [setPlayers, generateSimpleTeams, goToStep, addToast, setTeamsData]
  );

  const handlePositionSelection = useCallback(
    ({ teamOne: newTeamOne, teamTwo: newTeamTwo }: TeamsData) => {
      setTeamOne(newTeamOne);
      setTeamTwo(newTeamTwo);
      setTeamsData({ teamOne: newTeamOne, teamTwo: newTeamTwo });
      goToStep(3);
    },
    [setTeamOne, setTeamTwo, setTeamsData, goToStep]
  );

  const handleGoBack = useCallback(() => {
    if (step === 2) {
      goToStart();
    } else if (step === 3) {
      if (players.length === 16) {
        goToStep(2);
      } else {
        goToStart();
      }
    }
  }, [step, players.length, goToStart, goToStep]);

  const handleReset = useCallback(() => {
    resetTeams();
    goToStart();
  }, [resetTeams, goToStart]);

  // Global keyboard shortcuts
  useGlobalKeyboardShortcuts();

  // Step-specific keyboard shortcuts
  const stepShortcuts = useMemo(() => {
    const shortcuts = [];
    
    if (step > 1) {
      shortcuts.push({
        key: "b",
        action: handleGoBack,
        description: "Volver atrás",
      });
    }

    if (step === 3) {
      shortcuts.push({
        key: "r",
        action: () => {
          // This will be handled by the Teams component
        },
        description: "Redistribuir equipos",
      });
    }

    return shortcuts;
  }, [step, handleGoBack]);

  useKeyboardShortcuts(stepShortcuts);

  const renderCurrentStep = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <Suspense fallback={<PlayerFormSkeleton />}>
            <PlayerForm onFormSubmit={handleFormSubmit} />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<PositionSelectionSkeleton />}>
            <PositionSelection
              playerNames={players}
              onPositionSelection={handlePositionSelection}
              onGoBack={goToStart}
            />
          </Suspense>
        );
      case 3:
        return (
          <Teams onGoBack={handleReset} />
        );
      default:
        return null;
    }
  }, [
    step,
    players,
    handleFormSubmit,
    handlePositionSelection,
    handleReset,
    goToStart,
  ]);

  return (
    <HydrationProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-8">
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            {step === 1 && (
              <div className="space-y-4">
                <Image
                  src="/logo.png"
                  alt="Logo Equipapp"
                  width={280}
                  height={170}
                  className="mx-auto"
                  priority
                />
              </div>
            )}

            {step > 1 && (
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  onClick={handleGoBack}
                  className="text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Button>
                <StepIndicator currentStep={step} totalSteps={3} />
                <div className="w-8"></div>
              </div>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep}
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      </ToastProvider>
    </HydrationProvider>
  );
}

"use client";
import { useState, lazy, Suspense, useCallback, useMemo } from "react";
import Image from "next/image";
import type { TeamsData } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useNavigation } from "@/hooks/useNavigation";
import { useTeamGeneration } from "@/hooks/useTeamGeneration";
import { validateGoalkeepers } from "@/utils/playerValidation";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Lazy loading de componentes
const PlayerForm = lazy(() => import("@/components/PlayerForm"));
const PositionSelection = lazy(() => import("@/components/PositionSelection"));
// Import Teams directly to prevent re-rendering issues
import Teams from "@/components/Teams";

export default function Home() {
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const { toast } = useToast();
  const { step, goToStep, goToStart } = useNavigation();
  const {
    teamOne,
    teamTwo,
    generateSimpleTeams,
    resetTeams,
    setTeamOne,
    setTeamTwo,
  } = useTeamGeneration();

  const handleFormSubmit = useCallback(
    (names: string[]) => {
      setPlayerNames(names);

      const goalkeeperValidation = validateGoalkeepers(names);
      if (!goalkeeperValidation.isValid) {
        toast({
          title: "Error",
          description: goalkeeperValidation.message,
          variant: "destructive",
        });
        return;
      }

      if (names.length !== 16) {
        generateSimpleTeams(names);
        goToStep(3);
      } else {
        goToStep(2);
      }
    },
    [generateSimpleTeams, goToStep, toast]
  );

  const handlePositionSelection = useCallback(
    ({ teamOne: newTeamOne, teamTwo: newTeamTwo }: TeamsData) => {
      setTeamOne(newTeamOne);
      setTeamTwo(newTeamTwo);
      goToStep(3);
    },
    [setTeamOne, setTeamTwo, goToStep]
  );

  const handleGoBack = useCallback(() => {
    if (step === 2) {
      goToStart();
    } else if (step === 3) {
      if (playerNames.length === 16) {
        goToStep(2);
      } else {
        goToStart();
      }
    }
  }, [step, playerNames.length, goToStart, goToStep]);

  const handleReset = useCallback(() => {
    goToStart();
    setPlayerNames([]);
    resetTeams();
  }, [goToStart, resetTeams]);

  const renderCurrentStep = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PlayerForm onFormSubmit={handleFormSubmit} />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PositionSelection
              playerNames={playerNames}
              onPositionSelection={handlePositionSelection}
              onGoBack={goToStart}
            />
          </Suspense>
        );
      case 3:
        return (
          <Teams teamOne={teamOne} teamTwo={teamTwo} onGoBack={handleReset} />
        );
      default:
        return null;
    }
  }, [
    step,
    playerNames,
    teamOne,
    teamTwo,
    handleFormSubmit,
    handlePositionSelection,
    handleReset,
    goToStart,
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
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
              <div className="w-20" />
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
      <Toaster />
    </div>
  );
}

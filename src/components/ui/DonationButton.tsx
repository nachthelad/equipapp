"use client";
import { Button } from "./button";
import { Coffee } from "lucide-react";

interface DonationButtonProps {
  className?: string;
}

export function DonationButton({ className }: DonationButtonProps) {
  const handleDonationClick = () => {
    window.open("https://cafecito.app/nachthelad", "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      onClick={handleDonationClick}
      variant="ghost"
      size="sm"
      className={`text-white/70 hover:text-white hover:bg-white/10 p-2 ${className}`}
      title="¿Te gustó EquipApp? Invítame un café"
    >
      <Coffee className="w-4 h-4" />
    </Button>
  );
}
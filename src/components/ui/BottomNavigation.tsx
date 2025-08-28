"use client";
import { ReactNode } from "react";
import { Button } from "./button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BottomNavButton {
  icon: ReactNode;
  label?: string;
  action: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  className?: string;
  disabled?: boolean;
}

interface BottomNavigationProps {
  leftButton?: BottomNavButton;
  centerButton?: BottomNavButton;
  rightButton?: BottomNavButton;
  className?: string;
}

export function BottomNavigation({
  leftButton,
  centerButton,
  rightButton,
  className,
}: BottomNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-gray-900/50 backdrop-blur-lg border-t border-white/20",
        className
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Left Button */}
          <div className="flex justify-start">
            {leftButton && (
              <Button
                onClick={leftButton.action}
                variant={leftButton.variant || "outline"}
                disabled={leftButton.disabled}
                className={cn(
                  "bg-white/10 border-white/20 text-white hover:bg-white/20",
                  "min-w-[3rem] h-12 rounded-xl",
                  "flex items-center justify-center gap-2",
                  leftButton.className
                )}
              >
                {leftButton.icon}
                {leftButton.label && (
                  <span className="hidden sm:inline text-sm">
                    {leftButton.label}
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Center Button */}
          <div className="flex justify-center ">
            {centerButton && (
              <Button
                onClick={centerButton.action}
                variant={centerButton.variant || "default"}
                disabled={centerButton.disabled}
                className={cn(
                  "bg-white text-purple-700 hover:bg-white/90",
                  "min-w-[3rem] h-12 rounded-xl font-semibold",
                  "flex items-center justify-center gap-2",
                  centerButton.className
                )}
              >
                {centerButton.icon}
                {centerButton.label && (
                  <span className="hidden sm:inline text-sm">
                    {centerButton.label}
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Right Button */}
          <div className="flex justify-end">
            {rightButton && (
              <Button
                onClick={rightButton.action}
                variant={rightButton.variant || "outline"}
                disabled={rightButton.disabled}
                className={cn(
                  "bg-white/10 border-white/20 text-white hover:bg-white/20",
                  "min-w-[3rem] h-12 rounded-xl",
                  "flex items-center justify-center gap-2",
                  rightButton.className
                )}
              >
                {rightButton.icon}
                {rightButton.label && (
                  <span className="hidden sm:inline text-sm">
                    {rightButton.label}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

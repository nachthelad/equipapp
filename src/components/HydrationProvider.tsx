"use client";

import { useEffect } from "react";
import { useTeamStore } from "@/store/teamStore";
import { useAppStore } from "@/store/appStore";

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const rehydrateTeamStore = useTeamStore.persist?.rehydrate;
  const rehydrateAppStore = useAppStore.persist?.rehydrate;

  useEffect(() => {
    // Manually rehydrate stores on client side
    rehydrateTeamStore?.();
    rehydrateAppStore?.();
  }, [rehydrateTeamStore, rehydrateAppStore]);

  return <>{children}</>;
}
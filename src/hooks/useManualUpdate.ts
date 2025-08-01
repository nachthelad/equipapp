"use client";

import { useState, useCallback } from "react";
import {
  checkForNewVersion,
  forceUpdate,
  getVersionInfo,
} from "@/utils/version";

interface ManualUpdateInfo {
  isChecking: boolean;
  hasNewVersion: boolean;
  currentVersion: string;
  checkForUpdates: () => Promise<void>;
  forceUpdate: () => void;
  versionInfo: ReturnType<typeof getVersionInfo>;
}

export function useManualUpdate(): ManualUpdateInfo {
  const [isChecking, setIsChecking] = useState(false);
  const [hasNewVersion, setHasNewVersion] = useState(false);
  const [currentVersion] = useState(() => getVersionInfo());

  const checkForUpdates = useCallback(async () => {
    if (typeof window === "undefined") return;

    setIsChecking(true);
    try {
      const hasUpdate = await checkForNewVersion();
      setHasNewVersion(hasUpdate);

      // También verificar actualizaciones del service worker
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      }
    } catch (error) {
      console.error("Error verificando actualizaciones:", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const handleForceUpdate = useCallback(() => {
    forceUpdate();
  }, []);

  return {
    isChecking,
    hasNewVersion,
    currentVersion: currentVersion.version,
    checkForUpdates,
    forceUpdate: handleForceUpdate,
    versionInfo: currentVersion,
  };
}

"use client";

import { useManualUpdate } from "@/hooks/useManualUpdate";

export function VersionIndicator() {
  const { currentVersion } = useManualUpdate();

  return (
    <div className="fixed bottom-2 left-2 z-40">
      <div className="bg-black/20 text-white/60 text-xs px-2 py-1 rounded backdrop-blur-sm">
        v{currentVersion}
      </div>
    </div>
  );
}

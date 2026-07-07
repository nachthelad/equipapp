"use client";

import { Download } from "lucide-react";
import { APK_DOWNLOAD_URL } from "@/utils/apkDownload";
import { Button } from "./button";

export function UpdateButton() {
  return (
    <Button
      asChild
      type="button"
      variant="ghost"
      size="sm"
      className="relative p-2 text-white/70 hover:bg-white/10 hover:text-white"
    >
      <a
        href={APK_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Descargar APK"
        title="Descargar APK"
      >
        <Download className="h-4 w-4" />
      </a>
    </Button>
  );
}

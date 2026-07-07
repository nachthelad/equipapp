"use client";

import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { APK_DOWNLOAD_URL } from "@/utils/apkDownload";

export function ApkDownloadToast() {
  useEffect(() => {
    toast({
      title: "App para Android disponible",
      description: "Descargá el APK desde la última release.",
      persistent: true,
      action: (
        <a
          href={APK_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/30 bg-transparent px-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
        >
          Descargar APK
        </a>
      ),
    });
  }, []);

  return null;
}

"use client";
import { useState } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { APK_DOWNLOAD_URL } from "@/utils/apkDownload";

export function AppDownloadBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-[430px] mx-auto mb-3"
        >
          <div className="relative flex items-center gap-3 rounded-xl border border-green-400/30 bg-green-500/10 backdrop-blur-sm px-4 py-3 shadow-lg shadow-green-900/20">
            {/* Icon */}
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-green-400/20">
              <Smartphone className="w-4 h-4 text-green-300" />
            </div>

            {/* Text + link */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-green-200 leading-tight">
                ¡La app para Android ya está disponible!
              </p>
              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-0.5 text-xs text-green-300 hover:text-green-100 underline underline-offset-2 transition-colors"
              >
                <Download className="w-3 h-3" />
                Descargar APK
              </a>
            </div>

            {/* Close button */}
            <button
              onClick={() => setDismissed(true)}
              aria-label="Cerrar banner"
              className="flex-shrink-0 p-1 rounded-md text-green-300/60 hover:text-green-100 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

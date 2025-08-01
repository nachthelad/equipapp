"use client";

import { useState, useEffect } from "react";

interface UpdateInfo {
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  updateApp: () => void;
  skipUpdate: () => void;
}

export function useUpdateDetection(): UpdateInfo {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    // Verificar si el service worker está disponible
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Escuchar actualizaciones del service worker
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // Hay una nueva versión disponible
                setIsUpdateAvailable(true);
              }
            });
          }
        });

        // Verificar si ya hay una actualización disponible
        if (reg.waiting) {
          setIsUpdateAvailable(true);
        }
      });

      // Escuchar cambios en el service worker
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // El service worker ha cambiado, recargar la página
        window.location.reload();
      });
    }
  }, []);

  const updateApp = () => {
    if (registration?.waiting) {
      setIsUpdating(true);

      // Enviar mensaje al service worker para activar la actualización
      registration.waiting.postMessage({ type: "SKIP_WAITING" });

      // Recargar la página después de un breve delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const skipUpdate = () => {
    setIsUpdateAvailable(false);
  };

  return {
    isUpdateAvailable,
    isUpdating,
    updateApp,
    skipUpdate,
  };
}

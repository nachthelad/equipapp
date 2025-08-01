"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Registrar el service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw-custom.js")
        .then((registration) => {
          console.log("Service Worker registrado exitosamente:", registration);

          // Verificar actualizaciones cada 30 minutos
          setInterval(() => {
            registration.update();
          }, 30 * 60 * 1000);

          // Escuchar mensajes del service worker
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data && event.data.type === "UPDATE_CHECK") {
              console.log(
                "Verificación de actualización recibida:",
                event.data
              );
            }
          });
        })
        .catch((error) => {
          console.error("Error registrando Service Worker:", error);
        });
    }
  }, []);

  return null;
}

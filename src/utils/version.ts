// Configuración de versionado para la aplicación
export const APP_VERSION = "0.2.0"; // This will be auto-updated from package.json during build
export const BUILD_DATE = new Date().toISOString();
export const BUILD_VERSION = "1.20250827.1730"; // This will be auto-updated during build for cache busting

// Función para obtener información de la versión
export function getVersionInfo() {
  return {
    version: APP_VERSION, // User-facing version (from package.json)
    buildVersion: BUILD_VERSION, // Internal build version for cache busting
    buildDate: BUILD_DATE,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    isPWA:
      typeof window !== "undefined" &&
      window.matchMedia("(display-mode: standalone)").matches,
  };
}

// Función para verificar si hay una nueva versión disponible
export async function checkForNewVersion(): Promise<boolean> {
  try {
    const response = await fetch("/manifest.json", {
      cache: "no-cache",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!response.ok) {
      return false;
    }

    await response.json();

    // Comparar versiones (aquí puedes implementar tu lógica de versionado)
    // Por ahora, siempre retornamos false ya que no tenemos un sistema de versionado
    // en el manifest.json
    return false;
  } catch (error) {
    console.error("Error verificando nueva versión:", error);
    return false;
  }
}

// Función para forzar la actualización
export function forceUpdate() {
  if (typeof window !== "undefined") {
    // Limpiar todos los caches
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }

    // Recargar la página
    window.location.reload();
  }
}

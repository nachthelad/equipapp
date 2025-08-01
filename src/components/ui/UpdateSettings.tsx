"use client";

import { useState } from "react";
import { useManualUpdate } from "@/hooks/useManualUpdate";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { RefreshCw, Download, Info } from "lucide-react";

export function UpdateSettings() {
  const {
    isChecking,
    hasNewVersion,
    currentVersion,
    checkForUpdates,
    forceUpdate,
    versionInfo,
  } = useManualUpdate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckUpdates = async () => {
    await checkForUpdates();
  };

  const handleForceUpdate = () => {
    forceUpdate();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          Actualizaciones
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuración de Actualizaciones</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Información de la Aplicación</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>Versión actual: {currentVersion}</p>
              <p>
                Fecha de compilación:{" "}
                {new Date(versionInfo.buildDate).toLocaleDateString()}
              </p>
              <p>Modo PWA: {versionInfo.isPWA ? "Sí" : "No"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Verificar Actualizaciones</h4>
            <p className="text-sm text-muted-foreground">
              Verifica si hay una nueva versión disponible de la aplicación.
            </p>
            <Button
              onClick={handleCheckUpdates}
              disabled={isChecking}
              className="w-full"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verificar Actualizaciones
                </>
              )}
            </Button>
          </div>

          {hasNewVersion && (
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">
                ¡Nueva versión disponible!
              </h4>
              <p className="text-sm text-muted-foreground">
                Hay una nueva versión de la aplicación disponible.
              </p>
              <Button
                onClick={handleForceUpdate}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Actualizar Ahora
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Forzar Actualización</h4>
            <p className="text-sm text-muted-foreground">
              Fuerza la actualización de la aplicación limpiando el caché y
              recargando.
            </p>
            <Button
              onClick={handleForceUpdate}
              variant="destructive"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Forzar Actualización
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

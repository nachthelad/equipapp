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
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 text-white border-white/20 hover:bg-white/10 hover:text-white"
        >
          <Info className="h-4 w-4" />
          Actualizaciones
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-2xl border-0 max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Info className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-800">Configuración de Actualizaciones</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Información de la Aplicación</h4>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
              <p>Versión actual: <span className="font-medium">{currentVersion}</span></p>
              <p>
                Fecha de compilación:{" "}
                <span className="font-medium">{new Date(versionInfo.buildDate).toLocaleDateString()}</span>
              </p>
              <p>Modo PWA: <span className="font-medium">{versionInfo.isPWA ? "Sí" : "No"}</span></p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Verificar Actualizaciones</h4>
            <p className="text-sm text-gray-600">
              Verifica si hay una nueva versión disponible de la aplicación.
            </p>
            <Button
              onClick={handleCheckUpdates}
              disabled={isChecking}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl"
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
            <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                ¡Nueva versión disponible!
              </h4>
              <p className="text-sm text-green-600">
                Hay una nueva versión de la aplicación disponible.
              </p>
              <Button
                onClick={handleForceUpdate}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Actualizar Ahora
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Forzar Actualización</h4>
            <p className="text-sm text-gray-600">
              Fuerza la actualización de la aplicación limpiando el caché y recargando.
            </p>
            <Button
              onClick={handleForceUpdate}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
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

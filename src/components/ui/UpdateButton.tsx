"use client";

import { useState, useEffect } from "react";
import { useManualUpdate } from "@/hooks/useManualUpdate";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Download, RefreshCw, CheckCircle } from "lucide-react";

export function UpdateButton() {
  const {
    isChecking,
    hasNewVersion,
    checkForUpdates,
    forceUpdate,
    versionInfo,
  } = useManualUpdate();
  const [isOpen, setIsOpen] = useState(false);

  // Check for updates on component mount
  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  const handleUpdate = () => {
    forceUpdate();
    setIsOpen(false);
  };

  const handleCheckUpdates = async () => {
    await checkForUpdates();
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`text-white/70 hover:text-white hover:bg-white/10 p-2 relative ${
          hasNewVersion ? "animate-pulse" : ""
        }`}
      >
        <RefreshCw className="w-4 h-4" />
        {hasNewVersion && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white rounded-2xl border-0 max-w-md">
          {hasNewVersion ? (
            // Update available
            <>
              <DialogHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <DialogTitle className="text-xl font-bold text-gray-800">
                  ¡Nueva versión disponible!
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-4">
                    Hay una nueva versión de EquipApp lista para usar con mejoras y nuevas funciones.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
                    <p>Versión actual: {versionInfo.version}</p>
                    <p>Compilado: {new Date(versionInfo.buildDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 text-center">¿Qué incluye?</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Mejoras de rendimiento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Corrección de errores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Nuevas funcionalidades</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleUpdate}
                  disabled={isChecking}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 rounded-xl"
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Actualizar ahora
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="w-full"
                >
                  Recordar más tarde
                </Button>
              </div>
            </>
          ) : (
            // No update available / Settings
            <>
              <DialogHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <DialogTitle className="text-xl font-bold text-gray-800">
                  Aplicación actualizada
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-4">
                    Estás usando la versión más reciente de EquipApp.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
                    <p>Versión actual: {versionInfo.version}</p>
                    <p>Compilado: {new Date(versionInfo.buildDate).toLocaleDateString()}</p>
                    <p>Modo PWA: {versionInfo.isPWA ? "Sí" : "No"}</p>
                  </div>
                </div>

                <div className="space-y-3">
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
                        Buscar actualizaciones
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleUpdate}
                    variant="outline"
                    className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Forzar actualización
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
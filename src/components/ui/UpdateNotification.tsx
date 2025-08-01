"use client";

import { useUpdateDetection } from "@/hooks/useUpdateDetection";
import { Button } from "./button";
import { X, RefreshCw } from "lucide-react";

export function UpdateNotification() {
  const { isUpdateAvailable, isUpdating, updateApp, skipUpdate } =
    useUpdateDetection();

  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-blue-600 text-white rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <RefreshCw
            className={`h-5 w-5 ${isUpdating ? "animate-spin" : ""}`}
          />
          <div>
            <p className="font-medium">Nueva versión disponible</p>
            <p className="text-sm opacity-90">
              {isUpdating
                ? "Actualizando..."
                : "Hay una nueva versión de la aplicación disponible"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isUpdating && (
            <>
              <Button
                onClick={updateApp}
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Actualizar
              </Button>
              <Button
                onClick={skipUpdate}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-blue-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

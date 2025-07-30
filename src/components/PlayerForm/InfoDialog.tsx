"use client"

import type { InfoDialogProps } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Users, Target, Trophy } from "lucide-react"

export default function InfoDialog({ open, handleClose }: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-2xl border-0 max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-800">¿Cómo funciona?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Cantidad de jugadores</h4>
              <p className="text-gray-600 text-sm">Podés agregar 8, 10, 14 o 16 jugadores, uno por línea.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-green-600 text-lg">🧤</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Arqueros</h4>
              <p className="text-gray-600 text-sm">
                Agregá 🧤 al final del nombre para marcar arqueros automáticamente.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Posiciones</h4>
              <p className="text-gray-600 text-sm">
                Solo en partidos de 16 jugadores podés elegir posiciones específicas.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-2 rounded-xl"
          >
            ¡Entendido!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

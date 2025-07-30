interface PlayerCounterProps {
  count: number
  className?: string
}

export function PlayerCounter({ count, className = "" }: PlayerCounterProps) {
  const getStatusColor = () => {
    if ([8, 10, 14, 16].includes(count)) return "text-green-300"
    if (count > 0) return "text-yellow-300"
    return "text-white/50"
  }

  const getStatusMessage = () => {
    if ([8, 10, 14, 16].includes(count)) return "✓ Cantidad válida"
    if (count > 0) return "Debe ser 8, 10, 14 o 16"
    return "Mínimo 8 jugadores"
  }

  return (
    <div className={`flex items-center justify-between text-sm ${className}`}>
      <span className="text-white/70">Jugadores: {count}</span>
      <span className={`font-medium ${getStatusColor()}`}>{getStatusMessage()}</span>
    </div>
  )
}

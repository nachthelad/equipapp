interface PlayerCounterProps {
  count: number
  version?: string
  className?: string
}

export function PlayerCounter({ count, version, className = "" }: PlayerCounterProps) {
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
    <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm ${className}`}>
      <span className="text-white/70">Jugadores: {count}</span>
      {version ? (
        <span className="text-center text-xs text-white/45">v{version}</span>
      ) : (
        <span />
      )}
      <span className={`text-right font-medium ${getStatusColor()}`}>{getStatusMessage()}</span>
    </div>
  )
}

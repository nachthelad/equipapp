import type { PlayerWithPosition } from "@/types"

export function validatePositions(players: PlayerWithPosition[]): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const positionCounts = getPositionCounts(players)

  if (positionCounts.Arco !== 2) {
    errors.push("Debe haber exactamente 2 arqueros seleccionados")
  }

  if (positionCounts.Def !== 6) {
    errors.push("Debe haber exactamente 6 defensores seleccionados")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function getPositionCounts(players: PlayerWithPosition[]) {
  return {
    Arco: players.filter((p) => p.position === "Arco").length,
    Def: players.filter((p) => p.position === "Def").length,
    Medio: players.filter((p) => p.position === "Medio").length,
    Del: players.filter((p) => p.position === "Del").length,
    Jugador: players.filter((p) => p.position === "Jugador").length,
  }
}

export function generateBalancedTeamsFromPositions(players: PlayerWithPosition[]) {
  const goalkeepers = [...players.filter((player) => player.position === "Arco")].sort(() => Math.random() - 0.5)
  const defenders = [...players.filter((player) => player.position === "Def")].sort(() => Math.random() - 0.5)
  const midfielders = [...players.filter((player) => player.position === "Medio")].sort(() => Math.random() - 0.5)
  const forwards = [...players.filter((player) => player.position === "Del")].sort(() => Math.random() - 0.5)

  const teamOne = [goalkeepers[0], ...defenders.slice(0, 3), ...midfielders.slice(0, forwards.length > 0 ? 3 : 4)]
  const teamTwo = [
    goalkeepers[1],
    ...defenders.slice(3, 6),
    ...midfielders.slice(forwards.length > 0 ? 3 : 4, forwards.length > 0 ? 6 : 8),
  ]

  if (forwards.length > 0) {
    teamOne.push(forwards[0])
    if (forwards.length > 1) {
      teamTwo.push(forwards[1])
    }
  }

  return { teamOne, teamTwo }
}

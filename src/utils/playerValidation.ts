export function validateGoalkeepers(playerNames: string[]): { isValid: boolean; message?: string } {
  const goalkeepers = playerNames.filter((name) => name.includes("🧤"))

  if (goalkeepers.length === 1) {
    return {
      isValid: false,
      message: "⚽ Necesitás 2 arqueros (🧤) o ninguno. Agregá otro arquero o quitá el emoji 🧤",
    }
  }

  if (goalkeepers.length > 2) {
    return {
      isValid: false,
      message: `⚽ Tenés ${goalkeepers.length} arqueros, pero solo podés tener máximo 2. Quitá algunos emojis 🧤`,
    }
  }

  return { isValid: true }
}

export function validatePlayerCount(count: number): { isValid: boolean; message?: string } {
  const validCounts = [8, 10, 14, 16]

  if (count === 0) {
    return {
      isValid: false,
      message: "📝 Agregá al menos un jugador para formar equipos",
    }
  }

  if (!validCounts.includes(count)) {
    const closest = validCounts.reduce((prev, curr) => 
      Math.abs(curr - count) < Math.abs(prev - count) ? curr : prev
    )
    
    const diff = closest - count
    const action = diff > 0 ? "agregá" : "quitá"
    const amount = Math.abs(diff)
    
    return {
      isValid: false,
      message: `👥 Tenés ${count} jugadores. Para formar equipos necesitás 8, 10, 14 o 16 jugadores. Te sugerimos ${action} ${amount} jugador${amount !== 1 ? 'es' : ''} para llegar a ${closest}.`,
    }
  }

  return { isValid: true }
}

export function cleanPlayerName(name: string): string {
  return name
    .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ🧤]*|[^a-zA-Z0-9\s🧤áéíóúÁÉÍÓÚñÑ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/(^\w|\s\w|🧤\w)/g, (char: string) => char.toUpperCase())
}

export function validateDuplicateNames(playerNames: string[]): { isValid: boolean; message?: string; duplicates?: string[] } {
  const duplicates: string[] = []
  const seen = new Set<string>()
  
  for (const name of playerNames) {
    const cleanName = name.toLowerCase().replace("🧤", "").trim()
    if (seen.has(cleanName)) {
      if (!duplicates.includes(name)) {
        duplicates.push(name)
      }
    } else {
      seen.add(cleanName)
    }
  }
  
  if (duplicates.length > 0) {
    return {
      isValid: false,
      message: `🚫 Nombres duplicados encontrados: ${duplicates.join(", ")}. Cada jugador debe tener un nombre único.`,
      duplicates,
    }
  }
  
  return { isValid: true }
}

export function parsePlayerInput(input: string): string[] {
  return input
    .split(/\r?\n/)
    .filter((line: string) => line.trim() !== "")
    .map(cleanPlayerName)
}

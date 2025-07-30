export function validateGoalkeepers(playerNames: string[]): { isValid: boolean; message?: string } {
  const goalkeepers = playerNames.filter((name) => name.includes("🧤"))

  if (goalkeepers.length === 1) {
    return {
      isValid: false,
      message: "Por favor, poné 2 🧤 o no pongas ninguno",
    }
  }

  return { isValid: true }
}

export function validatePlayerCount(count: number): { isValid: boolean; message?: string } {
  const validCounts = [8, 10, 14, 16]

  if (!validCounts.includes(count)) {
    return {
      isValid: false,
      message: "La cantidad de jugadores debe ser 8, 10, 14 o 16",
    }
  }

  return { isValid: true }
}

export function cleanPlayerName(name: string): string {
  return name
    .replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ🧤]*|[^a-zA-Z0-9\s🧤áéíóúÁÉÍÓÚñÑ]/gu, "")
    .trim()
    .toLowerCase()
    .replace(/(^\w|\s\w|🧤\w)/g, (char: string) => char.toUpperCase())
}

export function parsePlayerInput(input: string): string[] {
  return input
    .split(/\r?\n/)
    .filter((line: string) => line.trim() !== "")
    .map(cleanPlayerName)
}

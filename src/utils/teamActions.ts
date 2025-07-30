import type { PlayerWithPosition } from "@/types"

export function formatTeamsForSharing(teamOne: PlayerWithPosition[], teamTwo: PlayerWithPosition[]): string {
  const formatPlayerText = (player: PlayerWithPosition) => {
    const playerName = player.name.replace("🧤", "")
    return player.position !== "Jugador" ? `${playerName} (${player.position})` : playerName
  }

  const teamOneText = teamOne.map(formatPlayerText).join("\n")
  const teamTwoText = teamTwo.map(formatPlayerText).join("\n")

  return `🖤 EQUIPO 1: NEGRO\n${teamOneText}\n\n🤍 EQUIPO 2: BLANCO\n${teamTwoText}`
}

export function copyToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return Promise.resolve()
    } catch (err) {
      document.body.removeChild(textArea)
      return Promise.reject(err)
    }
  }

  return navigator.clipboard.writeText(text)
}

export function shareViaWhatsApp(text: string): void {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappUrl, "_blank")
}

export type PlayerPosition = "Arco" | "Def" | "Medio" | "Del" | "Jugador"

export type PlayerWithPosition = {
  name: string
  position: PlayerPosition
}

export type PositionSelectionProps = {
  playerNames: string[]
  onPositionSelection: (data: TeamsData) => void
  onGoBack: () => void
}

export type TeamsData = {
  teamOne: PlayerWithPosition[]
  teamTwo: PlayerWithPosition[]
}

export type InfoDialogProps = {
  open: boolean
  handleClose: () => void
}

export type PlayerFormProps = {
  onFormSubmit: (playerNames: string[]) => void
}

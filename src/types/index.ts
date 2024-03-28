export type PlayerPosition = "Arco" | "Def" | "Medio" | "Del" | "Jugador";

export type PlayerWithPosition = {
  name: string;
  position: PlayerPosition;
};

export type PositionSelectionProps = {
  playerNames: string[];
  onPositionSelection: ({
    teamOne,
    teamTwo,
  }: {
    teamOne: PlayerWithPosition[];
    teamTwo: PlayerWithPosition[];
  }) => void;
  onGoBack: () => void;
};

export type TeamsProps = {
  teamOne: PlayerWithPosition[];
  teamTwo: PlayerWithPosition[];
};

export type TeamsData = {
  teamOne: PlayerWithPosition[];
  teamTwo: PlayerWithPosition[];
};

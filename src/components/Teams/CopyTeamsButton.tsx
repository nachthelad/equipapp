import { Button } from "@mui/material";
import { PlayerWithPosition } from "@/types";

type CopyTeamsProps = {
  teamOne: PlayerWithPosition[];
  teamTwo: PlayerWithPosition[];
  setSnackbarMessage: React.Dispatch<React.SetStateAction<string>>;
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CopyTeamsButton({
  teamOne,
  teamTwo,
  setSnackbarMessage,
  setOpenSnackbar,
}: CopyTeamsProps) {
  const copyTeamsToClipboard = () => {
    const teamOneText = teamOne
      .map((player) => {
        const playerName = player.name.replace("🧤", "");
        return player.position !== "Jugador"
          ? `${playerName} (${player.position})`
          : playerName;
      })
      .join("\n");
    const teamTwoText = teamTwo
      .map((player) => {
        const playerName = player.name.replace("🧤", "");
        return player.position !== "Jugador"
          ? `${playerName} (${player.position})`
          : playerName;
      })
      .join("\n");
    const fullText = `EQUIPO 1: NEGRO\n${teamOneText}\n\nEQUIPO 2: BLANCO\n${teamTwoText}`;

    navigator.clipboard.writeText(fullText).then(
      () => {
        setSnackbarMessage("Texto copiado al portapapeles");
        setOpenSnackbar(true);
      },
      (err) => {
        console.error("Error al copiar texto: ", err);
      }
    );
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={copyTeamsToClipboard}
      sx={{ borderRadius: "20px" }}>
      Copiar
    </Button>
  );
}

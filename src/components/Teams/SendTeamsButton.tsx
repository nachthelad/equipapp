import React from "react";
import { Button } from "@mui/material";
import { PlayerWithPosition } from "@/types";

interface SendTeamsProps {
  teamOne: PlayerWithPosition[];
  teamTwo: PlayerWithPosition[];
}

const SendTeamsButton: React.FC<SendTeamsProps> = ({ teamOne, teamTwo }) => {
  const sendViaWhatsApp = () => {
    const formatPlayerText = (player: PlayerWithPosition) => {
      const playerName = player.name.replace("🧤", "");
      return player.position !== "Jugador"
        ? `${playerName} (${player.position})`
        : playerName;
    };

    const teamOneText = teamOne.map(formatPlayerText).join("\n");
    const teamTwoText = teamTwo.map(formatPlayerText).join("\n");
    const fullText = `EQUIPO 1: NEGRO\n${teamOneText}\n\nEQUIPO 2: BLANCO\n${teamTwoText}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={sendViaWhatsApp}
      sx={{ borderRadius: "20px" }}>
      Enviar
    </Button>
  );
};

export default SendTeamsButton;

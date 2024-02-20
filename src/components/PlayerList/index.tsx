import { Typography } from '@mui/material';

interface PlayerListProps {
  players: string[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div>
      {players.map((player, index) => (
        <Typography key={index} variant="body1">
          {player}
        </Typography>
      ))}
    </div>
  );
};

export default PlayerList;

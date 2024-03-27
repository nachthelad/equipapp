import { Button, Grid, Typography } from "@mui/material";

type TeamsProps = {
  playerNames: string[]; // Aquí podrías pasar más información, como las posiciones
};

export default function Teams({ playerNames }: TeamsProps) {
  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item>
        <Typography variant="h4">Equipos Formados</Typography>
      </Grid>
      {playerNames.map((name, index) => (
        <Grid item key={index}>
          <Typography variant="body1">{name}</Typography>
        </Grid>
      ))}
      <Grid item>
        <Button variant="contained" color="primary">
          Reorganizar Equipos
        </Button>
      </Grid>
    </Grid>
  );
}

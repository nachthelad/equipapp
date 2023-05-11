function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getTeamSize(playerCount) {
  if (playerCount >= 16) return 8;
  if (playerCount >= 14) return 7;
  return 5;
}

function sortTeams() {
  const players = JSON.parse(localStorage.getItem("players"));
  const teamSize = getTeamSize(players.length);
  shuffle(players);

  if (teamSize === 5 || teamSize === 7) {
    const equipo1 = [];
    const equipo2 = [];

    for (let i = 0; i < players.length; i++) {
      if (i % 2 === 0) {
        equipo1.push(players[i]);
      } else {
        equipo2.push(players[i]);
      }
    }

    localStorage.setItem("equipo1", JSON.stringify(equipo1));
    localStorage.setItem("equipo2", JSON.stringify(equipo2));
    return { equipo1, equipo2 };
  } else {
    // El código original para equipos de 8v8 con posiciones y categorías
    const arqueros = players.filter((p) => p.position === "Arq");
    const defensores = players.filter((p) => p.position === "Def");
    const mediocampistas = players.filter((p) => p.position === "Medio");
    const delanteros = players.filter((p) => p.position === "Del");

    const team1 = [];
    const team2 = [];

    team1.push(arqueros.pop());
    team2.push(arqueros.pop());

    // Filtrar jugadores por categoría
    const defensoresCatA = defensores.filter((p) => p.category === "A");
    const defensoresNoCatA = defensores.filter((p) => p.category !== "A");
    const mediocampistasCatA = mediocampistas.filter((p) => p.category === "A");
    const mediocampistasNoCatA = mediocampistas.filter(
      (p) => p.category !== "A"
    );
    const delanterosCatA = delanteros.filter((p) => p.category === "A");
    const delanterosNoCatA = delanteros.filter((p) => p.category !== "A");

    const requiredDefensores = 3;
    for (let i = 0; i < requiredDefensores; i++) {
      if (i % 2 === 0) {
        team1.push(defensoresCatA.pop() || defensoresNoCatA.pop());
        team2.push(defensoresNoCatA.pop());
      } else {
        team1.push(defensoresNoCatA.pop());
        team2.push(defensoresCatA.pop() || defensoresNoCatA.pop());
      }
    }

    const requiredMediocampistas = delanteros.length ? 3 : 4;
    for (let i = 0; i < requiredMediocampistas; i++) {
      if (i % 2 === 0) {
        team1.push(mediocampistasCatA.pop() || mediocampistasNoCatA.pop());
        team2.push(mediocampistasNoCatA.pop());
      } else {
        team1.push(mediocampistasNoCatA.pop());
        team2.push(mediocampistasCatA.pop() || mediocampistasNoCatA.pop());
      }
    }

    if (delanteros.length) {
      team1.push(delanterosCatA.pop() || delanterosNoCatA.pop());
      team2.push(delanterosCatA.pop() || delanterosNoCatA.pop());
    }

    // Almacenar los equipos en localStorage
    localStorage.setItem("equipo1", JSON.stringify(team1));
    localStorage.setItem("equipo2", JSON.stringify(team2));

    return { equipo1: team1, equipo2: team2 };
  }
}

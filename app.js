function generatePlayers() {
  // Obtener el contenido del elemento textarea
  const playersTextarea = document.getElementById("players");
  const playersContent = playersTextarea.value.trim();

  // Eliminar líneas vacías y separar el contenido por líneas
  const playersLines = playersContent
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  // Limpiar y capitalizar cada línea
  const cleanedLines = playersLines.map((line) => {
    // Eliminar caracteres no alfabéticos
    let cleanedLine = line
      .replace(/[^a-zA-Z0-9\s🧤]|(?<![a-zA-Z\s])\d+/g, "")
      .trim();
    // Capitalizar la primera letra de cada palabra si no está capitalizada
    return cleanedLine.replace(/\b\w/g, (char) => char.toUpperCase());
  });

  // Comprobar que haya al menos 10 jugadores
  if (cleanedLines.length !== 10 && cleanedLines.length !== 14 && cleanedLines.length !== 16) {
    alert("La cantidad de jugadores debe ser 10, 14 o 16");
    return;
  }

  // Crear objetos de jugador y almacenar el array en localStorage
  const playerObjects = cleanedLines.map((playerName) => {
    const isGoalkeeper = playerName.includes("🧤");
    // Eliminar el icono de los guantes en el nombre del jugador
    const cleanedPlayerName = playerName.replace("🧤", "");
    return {
      name: cleanedPlayerName,
      position: isGoalkeeper ? "Arq" : "",
    };
  });

  localStorage.setItem("players", JSON.stringify(playerObjects));
  // Redirigir a equipos.html si hay 10 o 14 jugadores, de lo contrario, redirigir a armar.html
  if (cleanedLines.length === 10 || cleanedLines.length === 14) {
    window.location.href = "equipos.html";
  } else {
    window.location.href = "armar.html";
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log("Service Worker registrado con éxito:", registration);
      })
      .catch((error) => {
        console.log("Error al registrar el Service Worker:", error);
      });
  });
}

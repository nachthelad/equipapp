/*
Esta funcion lo que debe hacer es agarrar el contenido del textarea con id="players", 
tiene que eliminar lineas vacias, separar por lineas, y por cada linea eliminar cualquier 
caracter que no sea letras o espacios. Despues, por cada linea debe eliminar espacios que hayan quedado 
al principio o al final.
El resultado final de todo esto, debe ser un array de strings.
Luego de esto el array debe tener 16 elementos, si no lo tiene hacer una alerta y terminar la funcion.
Si son 16 elementos, necesito guardar este array en localStorage y redireccionar a armar.html
*/
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
    let cleanedLine = line.replace(/[^a-zA-Z0-9\s🧤]|(?<![a-zA-Z\s])\d+/g, "").trim();
    // Capitalizar la primera letra de cada palabra si no está capitalizada
    return cleanedLine.replace(/\b\w/g, (char) => char.toUpperCase());
  });

  // Comprobar que haya exactamente 16 jugadores
  if (cleanedLines.length !== 16) {
    alert("Debe haber al menos 16 jugadores.");
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
  window.location.href = "armar.html";
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}


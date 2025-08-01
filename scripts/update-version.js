const fs = require("fs");
const path = require("path");

// Función para generar una versión basada en timestamp
function generateVersion() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `1.${year}${month}${day}.${hour}${minute}`;
}

// Función para actualizar la versión en un archivo
function updateVersionInFile(filePath, version) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Actualizar en manifest.json
    if (filePath.includes("manifest.json")) {
      content = content.replace(
        /"version":\s*"[^"]*"/,
        `"version": "${version}"`
      );
    }

    // Actualizar en version.ts
    if (filePath.includes("version.ts")) {
      content = content.replace(
        /export const APP_VERSION = '[^']*'/,
        `export const APP_VERSION = '${version}'`
      );
    }

    // Actualizar en sw-custom.js
    if (filePath.includes("sw-custom.js")) {
      content = content.replace(
        /const CACHE_NAME = '[^']*'/,
        `const CACHE_NAME = 'equipapp-${version}'`
      );
      content = content.replace(
        /const STATIC_CACHE = '[^']*'/,
        `const STATIC_CACHE = 'equipapp-static-${version}'`
      );
      content = content.replace(
        /const DYNAMIC_CACHE = '[^']*'/,
        `const DYNAMIC_CACHE = 'equipapp-dynamic-${version}'`
      );
    }

    fs.writeFileSync(filePath, content);
    console.log(`✅ Versión actualizada en ${filePath}: ${version}`);
  } catch (error) {
    console.error(
      `❌ Error actualizando versión en ${filePath}:`,
      error.message
    );
  }
}

// Función principal
function main() {
  const version = generateVersion();
  console.log(`🔄 Actualizando versión a: ${version}`);

  const filesToUpdate = [
    "public/manifest.json",
    "src/utils/version.ts",
    "public/sw-custom.js",
  ];

  filesToUpdate.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      updateVersionInFile(filePath, version);
    } else {
      console.warn(`⚠️ Archivo no encontrado: ${filePath}`);
    }
  });

  console.log("✅ Actualización de versión completada");
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { generateVersion, updateVersionInFile };

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

// Función para leer la versión del package.json
function getPackageVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return packageJson.version;
  } catch (error) {
    console.error("❌ Error leyendo package.json:", error.message);
    return "0.1.0"; // fallback
  }
}

// Función principal
function main() {
  const buildVersion = generateVersion(); // For cache busting
  const userVersion = getPackageVersion(); // For user display
  
  console.log(`🔄 Actualizando versión de usuario: ${userVersion}`);
  console.log(`🔄 Actualizando versión de build: ${buildVersion}`);

  // Update files with appropriate versions
  updateVersionInFile("public/manifest.json", userVersion); // Use user version in manifest
  updateAppVersionInFile("src/utils/version.ts", userVersion, buildVersion); // Update both versions
  updateVersionInFile("public/sw-custom.js", buildVersion); // Use build version for cache names

  console.log("✅ Actualización de versión completada");
}

// New function to update both versions in version.ts
function updateAppVersionInFile(filePath, userVersion, buildVersion) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    
    // Update APP_VERSION (user-facing)
    content = content.replace(
      /export const APP_VERSION = '[^']*'/,
      `export const APP_VERSION = '${userVersion}'`
    );
    
    // Update BUILD_VERSION (cache-busting)
    content = content.replace(
      /export const BUILD_VERSION = '[^']*'/,
      `export const BUILD_VERSION = '${buildVersion}'`
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Versiones actualizadas en ${filePath}:`);
    console.log(`   - Usuario: ${userVersion}`);
    console.log(`   - Build: ${buildVersion}`);
  } catch (error) {
    console.error(`❌ Error actualizando versiones en ${filePath}:`, error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { generateVersion, updateVersionInFile, getPackageVersion, updateAppVersionInFile };

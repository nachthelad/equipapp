import { chromium } from "playwright";

const baseUrl = "http://localhost:3000";
const players = [
  "Juan Perez",
  "Diego Garcia",
  "Carlos Lopez",
  "Martin Diaz",
  "Nicolas Romero",
  "Pablo Suarez",
  "Tomas Vera",
  "Lucas Molina",
].join("\n");

const browser = await chromium.launch();
const context = await browser.newContext({
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.getByLabel("Lista de jugadores").fill(players);
await page.getByRole("button", { name: /armar equipos/i }).click();
await page.getByText("EQUIPO NEGRO").waitFor();
await page.getByText("EQUIPO BLANCO").waitFor();

await page.getByRole("button", { name: /redistribuir/i }).click();
await page.getByText(/equipos redistribuidos/i).waitFor({ timeout: 5000 });

const teamOneFirst = page.locator(".team-card").first().locator(".group").first();
const teamTwoFirst = page.locator(".team-card").nth(1).locator(".group").first();
await teamOneFirst.click();
await teamTwoFirst.click();

await page.getByRole("button", { name: /^copiar$/i }).click();
await page.getByText(/se copiaron al portapapeles/i).waitFor({ timeout: 5000 });

await page.reload({ waitUntil: "networkidle" });
await page.getByText("EQUIPO NEGRO").waitFor();
await page.getByText("EQUIPO BLANCO").waitFor();

const serviceWorkerResponse = await page.request.get(`${baseUrl}/sw-custom.js`);
if (!serviceWorkerResponse.ok()) {
  throw new Error(`sw-custom.js returned ${serviceWorkerResponse.status()}`);
}

await browser.close();

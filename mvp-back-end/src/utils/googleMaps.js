const MAP_ERROR = "Cole o HTML de incorporação do Google Maps (Compartilhar → Incorporar um mapa)";

// Aceita o HTML do <iframe> que o Google Maps fornece (ou só a URL) e devolve apenas a URL do mapa.
// Texto vazio devolve null, que remove o mapa.
function extractMapUrl(input) {
  if (input == null) return null;
  const text = String(input).trim();
  if (text === "") return null;

  // Respeita o tipo de aspas do atributo, para nomes com apóstrofo (ex.: Olho D'água)
  const match = text.match(/src\s*=\s*(["'])(.*?)\1/i);
  const url = (match ? match[2] : text).replace(/&amp;/g, "&").trim();

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(MAP_ERROR);
  }

  const isEmbed =
    parsed.protocol === "https:" &&
    ((parsed.hostname === "www.google.com" && parsed.pathname.startsWith("/maps/embed")) ||
      (parsed.hostname === "maps.google.com" && parsed.searchParams.get("output") === "embed"));

  if (!isEmbed) throw new Error(MAP_ERROR);
  return parsed.toString();
}

module.exports = { extractMapUrl, MAP_ERROR };

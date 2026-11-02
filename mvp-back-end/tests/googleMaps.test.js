const { extractMapUrl, MAP_ERROR } = require("../src/utils/googleMaps");

const EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3!2d-42.98!3d-22.41";

describe("extractMapUrl", () => {
  test("recorta a URL do HTML de incorporação do Google Maps", () => {
    const html = `<iframe src="${EMBED}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;

    expect(extractMapUrl(html)).toBe(EMBED);
  });

  test("aceita a URL pura", () => {
    expect(extractMapUrl(`  ${EMBED}  `)).toBe(EMBED);
  });

  test("converte &amp; em &", () => {
    const html = `<iframe src='https://maps.google.com/maps?q=Teresopolis&amp;output=embed'></iframe>`;

    expect(extractMapUrl(html)).toBe("https://maps.google.com/maps?q=Teresopolis&output=embed");
  });

  test("mantém apóstrofos dentro da URL entre aspas duplas", () => {
    const html = `<iframe src="https://maps.google.com/maps?q=Cachoeira Olho D'água&amp;output=embed"></iframe>`;

    expect(extractMapUrl(html)).toContain("output=embed");
  });

  test("texto vazio ou ausente retorna null", () => {
    expect(extractMapUrl("")).toBeNull();
    expect(extractMapUrl("   ")).toBeNull();
    expect(extractMapUrl(undefined)).toBeNull();
  });

  test("recusa iframe de outro site", () => {
    expect(() => extractMapUrl('<iframe src="https://example.com/maps/embed"></iframe>')).toThrow(MAP_ERROR);
  });

  test("recusa link comum do Google Maps (que não é de incorporação)", () => {
    expect(() => extractMapUrl("https://maps.app.goo.gl/abc123")).toThrow(MAP_ERROR);
    expect(() => extractMapUrl("http://www.google.com/maps/embed?pb=1")).toThrow(MAP_ERROR);
  });

  test("recusa texto qualquer", () => {
    expect(() => extractMapUrl("Parque Nacional")).toThrow(MAP_ERROR);
  });
});

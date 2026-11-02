const fs = require("fs");
const prisma = require("../src/lib/prisma");
const {
  createTrilha,
  listTrilhas,
  getTrilha,
  updateTrilha,
  deleteTrilha
} = require("../src/controllers/trilhas.controller");

jest.mock("../src/lib/prisma", () => ({
  trilha: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  imagemTrilha: {
    deleteMany: jest.fn()
  }
}));
jest.mock("fs");

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const trilhaBase = {
  id: 1,
  name: "Trilha A",
  summary: "Resumo",
  distance: "500m",
  location: "Local",
  images: []
};

beforeEach(() => jest.clearAllMocks());

// --- createTrilha ---
describe("createTrilha", () => {
  test("cria trilha e retorna objeto criado", async () => {
    const req = { body: { name: "Trilha A", summary: "Resumo", distance: "500m", location: "Local" }, files: [] };
    const res = makeRes();
    prisma.trilha.create.mockResolvedValue(trilhaBase);

    await createTrilha(req, res);

    expect(prisma.trilha.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(trilhaBase);
  });

  test("retorna 500 em caso de erro", async () => {
    const req = { body: {}, files: [] };
    const res = makeRes();
    prisma.trilha.create.mockRejectedValue(new Error("db error"));

    await createTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// --- listTrilhas ---
describe("listTrilhas", () => {
  test("retorna lista de trilhas", async () => {
    const req = {};
    const res = makeRes();
    prisma.trilha.findMany.mockResolvedValue([trilhaBase]);

    await listTrilhas(req, res);

    expect(res.json).toHaveBeenCalledWith([trilhaBase]);
  });

  test("retorna 500 em caso de erro", async () => {
    const req = {};
    const res = makeRes();
    prisma.trilha.findMany.mockRejectedValue(new Error("db error"));

    await listTrilhas(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// --- getTrilha ---
describe("getTrilha", () => {
  test("retorna trilha pelo ID", async () => {
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.trilha.findUnique.mockResolvedValue(trilhaBase);

    await getTrilha(req, res);

    expect(res.json).toHaveBeenCalledWith(trilhaBase);
  });

  test("retorna 404 quando trilha não existe", async () => {
    const req = { params: { id: "99" } };
    const res = makeRes();
    prisma.trilha.findUnique.mockResolvedValue(null);

    await getTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" } };
    const res = makeRes();

    await getTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("retorna 500 em caso de erro", async () => {
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.trilha.findUnique.mockRejectedValue(new Error("db error"));

    await getTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// --- updateTrilha ---
describe("updateTrilha", () => {
  test("atualiza trilha sem nova imagem", async () => {
    const req = { params: { id: "1" }, body: { name: "Novo nome" }, files: [] };
    const res = makeRes();
    const updated = { ...trilhaBase, name: "Novo nome" };
    prisma.trilha.findUnique.mockResolvedValue(trilhaBase);
    prisma.trilha.update.mockResolvedValue(updated);

    await updateTrilha(req, res);

    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test("deleta imagem antiga do disco ao enviar nova imagem", async () => {
    const existing = { ...trilhaBase, images: [{ id: 1, src: "/uploads/old.jpg" }] };
    const req = {
      params: { id: "1" },
      body: { imagesMantidas: [] },
      files: [{ filename: "new.jpg" }]
    };
    const res = makeRes();
    prisma.trilha.findUnique.mockResolvedValue(existing);
    prisma.imagemTrilha.deleteMany.mockResolvedValue({});
    prisma.trilha.update.mockResolvedValue(trilhaBase);
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    await updateTrilha(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(trilhaBase);
  });

  test("retorna 404 quando trilha não existe", async () => {
    const req = { params: { id: "99" }, body: {}, files: [] };
    const res = makeRes();
    prisma.trilha.findUnique.mockResolvedValue(null);

    await updateTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" }, body: {}, files: [] };
    const res = makeRes();

    await updateTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// --- deleteTrilha ---
describe("deleteTrilha", () => {
  test("deleta trilha e remove imagens do disco", async () => {
    const existing = { ...trilhaBase, images: [{ id: 1, src: "/uploads/img.jpg" }] };
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.trilha.findUnique.mockResolvedValue(existing);
    prisma.trilha.delete.mockResolvedValue({});
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    await deleteTrilha(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Trilha deletada com sucesso" });
  });

  test("retorna 404 quando trilha não existe", async () => {
    const req = { params: { id: "99" } };
    const res = makeRes();
    prisma.trilha.findUnique.mockResolvedValue(null);

    await deleteTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" } };
    const res = makeRes();

    await deleteTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

// --- mapa (HTML do Google Maps) ---
describe("mapa da trilha", () => {
  const EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12";
  const HTML = `<iframe src="${EMBED}" width="600" height="450"></iframe>`;

  test("createTrilha salva apenas a URL recortada do HTML", async () => {
    const req = { body: { name: "Trilha A", summary: "Resumo", distance: "500m", location: "Local", map: HTML }, files: [] };
    const res = makeRes();
    prisma.trilha.create.mockResolvedValue({ ...trilhaBase, mapUrl: EMBED });

    await createTrilha(req, res);

    expect(prisma.trilha.create.mock.calls[0][0].data.mapUrl).toBe(EMBED);
  });

  test("createTrilha retorna 400 e descarta uploads quando o HTML é inválido", async () => {
    const req = { body: { name: "Trilha A", map: "<iframe src='https://example.com'></iframe>" }, files: [{ path: "/tmp/a.jpg" }] };
    const res = makeRes();
    fs.existsSync.mockReturnValue(true);

    await createTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(prisma.trilha.create).not.toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalledWith("/tmp/a.jpg");
  });

  test("updateTrilha com map vazio remove o mapa", async () => {
    const req = { params: { id: "1" }, body: { map: "" }, files: [] };
    const res = makeRes();
    prisma.trilha.findUnique.mockResolvedValue({ ...trilhaBase, mapUrl: EMBED });
    prisma.trilha.update.mockResolvedValue({ ...trilhaBase, mapUrl: null });

    await updateTrilha(req, res);

    expect(prisma.trilha.update.mock.calls[0][0].data.mapUrl).toBeNull();
  });

  test("updateTrilha sem o campo map não altera o mapa", async () => {
    const req = { params: { id: "1" }, body: { name: "Novo" }, files: [] };
    const res = makeRes();
    prisma.trilha.findUnique.mockResolvedValue(trilhaBase);
    prisma.trilha.update.mockResolvedValue(trilhaBase);

    await updateTrilha(req, res);

    expect(prisma.trilha.update.mock.calls[0][0].data).not.toHaveProperty("mapUrl");
  });

  test("updateTrilha retorna 400 quando o HTML é inválido", async () => {
    const req = { params: { id: "1" }, body: { map: "texto qualquer" }, files: [] };
    const res = makeRes();
    prisma.trilha.findUnique.mockResolvedValue(trilhaBase);

    await updateTrilha(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(prisma.trilha.update).not.toHaveBeenCalled();
  });
});

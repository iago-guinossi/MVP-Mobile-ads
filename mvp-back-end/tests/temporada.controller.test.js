const fs = require("fs");
const prisma = require("../src/lib/prisma");
const {
  createTemporada,
  listTemporadas,
  getTemporada,
  updateTemporada,
  deleteTemporada
} = require("../src/controllers/temporada.controller");

jest.mock("../src/lib/prisma", () => ({
  temporada: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));
jest.mock("fs");

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const temporadaBase = {
  id: 1,
  text: "Texto da temporada",
  image: "/uploads/img.jpg"
};

beforeEach(() => jest.clearAllMocks());

describe("createTemporada", () => {
  test("cria temporada com imagem", async () => {
    const req = { body: { text: "Texto" }, file: { filename: "img.jpg" } };
    const res = makeRes();
    prisma.temporada.create.mockResolvedValue(temporadaBase);

    await createTemporada(req, res);

    expect(prisma.temporada.create).toHaveBeenCalledWith({
      data: { text: "Texto", image: "/uploads/img.jpg" }
    });
    expect(res.json).toHaveBeenCalledWith(temporadaBase);
  });

  test("cria temporada sem imagem (image vazio)", async () => {
    const req = { body: { text: "Texto" }, file: null };
    const res = makeRes();
    prisma.temporada.create.mockResolvedValue({ ...temporadaBase, image: "" });

    await createTemporada(req, res);

    expect(prisma.temporada.create).toHaveBeenCalledWith({
      data: { text: "Texto", image: "" }
    });
  });

  test("retorna 500 em caso de erro", async () => {
    const req = { body: {}, file: null };
    const res = makeRes();
    prisma.temporada.create.mockRejectedValue(new Error("db error"));

    await createTemporada(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("listTemporadas", () => {
  test("retorna lista de temporadas", async () => {
    const res = makeRes();
    prisma.temporada.findMany.mockResolvedValue([temporadaBase]);

    await listTemporadas({}, res);

    expect(res.json).toHaveBeenCalledWith([temporadaBase]);
  });

  test("retorna 500 em caso de erro", async () => {
    const res = makeRes();
    prisma.temporada.findMany.mockRejectedValue(new Error("db error"));

    await listTemporadas({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getTemporada", () => {
  test("retorna temporada pelo ID", async () => {
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.temporada.findUnique.mockResolvedValue(temporadaBase);

    await getTemporada(req, res);

    expect(res.json).toHaveBeenCalledWith(temporadaBase);
  });

  test("retorna 404 quando temporada não existe", async () => {
    const req = { params: { id: "99" } };
    const res = makeRes();
    prisma.temporada.findUnique.mockResolvedValue(null);

    await getTemporada(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" } };
    const res = makeRes();

    await getTemporada(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("retorna 500 em caso de erro", async () => {
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.temporada.findUnique.mockRejectedValue(new Error("db error"));

    await getTemporada(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("updateTemporada", () => {
  test("atualiza texto sem trocar imagem", async () => {
    const req = { params: { id: "1" }, body: { text: "Novo texto" }, file: null };
    const res = makeRes();
    const updated = { ...temporadaBase, text: "Novo texto" };
    prisma.temporada.findUnique.mockResolvedValue(temporadaBase);
    prisma.temporada.update.mockResolvedValue(updated);

    await updateTemporada(req, res);

    expect(fs.unlinkSync).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test("deleta imagem antiga e salva nova quando req.file está presente", async () => {
    const req = { params: { id: "1" }, body: {}, file: { filename: "new.jpg" } };
    const res = makeRes();
    const updated = { ...temporadaBase, image: "/uploads/new.jpg" };
    prisma.temporada.findUnique.mockResolvedValue(temporadaBase);
    prisma.temporada.update.mockResolvedValue(updated);
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    await updateTemporada(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test("retorna 404 quando temporada não existe", async () => {
    const req = { params: { id: "99" }, body: {}, file: null };
    const res = makeRes();
    prisma.temporada.findUnique.mockResolvedValue(null);

    await updateTemporada(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" }, body: {}, file: null };
    const res = makeRes();

    await updateTemporada(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("deleteTemporada", () => {
  test("deleta temporada e remove imagem do disco", async () => {
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.temporada.findUnique.mockResolvedValue(temporadaBase);
    prisma.temporada.delete.mockResolvedValue({});
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    await deleteTemporada(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Temporada deletada com sucesso" });
  });

  test("retorna 404 quando temporada não existe", async () => {
    const req = { params: { id: "99" } };
    const res = makeRes();
    prisma.temporada.findUnique.mockResolvedValue(null);

    await deleteTemporada(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" } };
    const res = makeRes();

    await deleteTemporada(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

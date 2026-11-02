const fs = require("fs");
const prisma = require("../src/lib/prisma");
const {
  createCachoeira,
  listCachoeiras,
  getCachoeira,
  updateCachoeira,
  deleteCachoeira
} = require("../src/controllers/cachoeiras.controller");

jest.mock("../src/lib/prisma", () => ({
  cachoeira: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  imagemCachoeira: {
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

const cachoiraBase = {
  id: 1,
  name: "Cachoeira A",
  summary: "Resumo",
  location: "Local",
  images: []
};

beforeEach(() => jest.clearAllMocks());

describe("createCachoeira", () => {
  test("cria cachoeira e retorna objeto criado", async () => {
    const req = { body: { name: "Cachoeira A", summary: "Resumo", location: "Local" }, files: [] };
    const res = makeRes();
    prisma.cachoeira.create.mockResolvedValue(cachoiraBase);

    await createCachoeira(req, res);

    expect(res.json).toHaveBeenCalledWith(cachoiraBase);
  });

  test("retorna 500 em caso de erro", async () => {
    const req = { body: {}, files: [] };
    const res = makeRes();
    prisma.cachoeira.create.mockRejectedValue(new Error("db error"));

    await createCachoeira(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("listCachoeiras", () => {
  test("retorna lista de cachoeiras", async () => {
    const res = makeRes();
    prisma.cachoeira.findMany.mockResolvedValue([cachoiraBase]);

    await listCachoeiras({}, res);

    expect(res.json).toHaveBeenCalledWith([cachoiraBase]);
  });

  test("retorna 500 em caso de erro", async () => {
    const res = makeRes();
    prisma.cachoeira.findMany.mockRejectedValue(new Error("db error"));

    await listCachoeiras({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getCachoeira", () => {
  test("retorna cachoeira pelo ID", async () => {
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.cachoeira.findUnique.mockResolvedValue(cachoiraBase);

    await getCachoeira(req, res);

    expect(res.json).toHaveBeenCalledWith(cachoiraBase);
  });

  test("retorna 404 quando cachoeira não existe", async () => {
    const req = { params: { id: "99" } };
    const res = makeRes();
    prisma.cachoeira.findUnique.mockResolvedValue(null);

    await getCachoeira(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" } };
    const res = makeRes();

    await getCachoeira(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("retorna 500 em caso de erro", async () => {
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.cachoeira.findUnique.mockRejectedValue(new Error("db error"));

    await getCachoeira(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("updateCachoeira", () => {
  test("atualiza cachoeira sem nova imagem", async () => {
    const req = { params: { id: "1" }, body: { name: "Novo nome" }, files: [] };
    const res = makeRes();
    const updated = { ...cachoiraBase, name: "Novo nome" };
    prisma.cachoeira.findUnique.mockResolvedValue(cachoiraBase);
    prisma.cachoeira.update.mockResolvedValue(updated);

    await updateCachoeira(req, res);

    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test("deleta imagem antiga ao enviar nova imagem", async () => {
    const existing = { ...cachoiraBase, images: [{ id: 1, src: "/uploads/old.jpg" }] };
    const req = { params: { id: "1" }, body: { imagesMantidas: [] }, files: [{ filename: "new.jpg" }] };
    const res = makeRes();
    prisma.cachoeira.findUnique.mockResolvedValue(existing);
    prisma.imagemCachoeira.deleteMany.mockResolvedValue({});
    prisma.cachoeira.update.mockResolvedValue(cachoiraBase);
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    await updateCachoeira(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(cachoiraBase);
  });

  test("retorna 404 quando cachoeira não existe", async () => {
    const req = { params: { id: "99" }, body: {}, files: [] };
    const res = makeRes();
    prisma.cachoeira.findUnique.mockResolvedValue(null);

    await updateCachoeira(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" }, body: {}, files: [] };
    const res = makeRes();

    await updateCachoeira(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("deleteCachoeira", () => {
  test("deleta cachoeira e remove imagens do disco", async () => {
    const existing = { ...cachoiraBase, images: [{ id: 1, src: "/uploads/img.jpg" }] };
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.cachoeira.findUnique.mockResolvedValue(existing);
    prisma.cachoeira.delete.mockResolvedValue({});
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    await deleteCachoeira(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Cachoeira deletada com sucesso" });
  });

  test("retorna 404 quando cachoeira não existe", async () => {
    const req = { params: { id: "99" } };
    const res = makeRes();
    prisma.cachoeira.findUnique.mockResolvedValue(null);

    await deleteCachoeira(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" } };
    const res = makeRes();

    await deleteCachoeira(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

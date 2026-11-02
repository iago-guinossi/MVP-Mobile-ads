const fs = require("fs");
const prisma = require("../src/lib/prisma");
const {
  createEvento,
  listEventos,
  getEvento,
  updateEvento,
  deleteEvento
} = require("../src/controllers/eventos.controller");

jest.mock("../src/lib/prisma", () => ({
  evento: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  imagemEvento: {
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

const eventoBase = {
  id: 1,
  name: "Evento A",
  summary: "Resumo",
  location: "Local",
  date: "10/10/2025",
  images: []
};

beforeEach(() => jest.clearAllMocks());

describe("createEvento", () => {
  test("cria evento e retorna objeto criado", async () => {
    const req = { body: { name: "Evento A", summary: "Resumo", location: "Local", date: "10/10/2025" }, files: [] };
    const res = makeRes();
    prisma.evento.create.mockResolvedValue(eventoBase);

    await createEvento(req, res);

    expect(res.json).toHaveBeenCalledWith(eventoBase);
  });

  test("retorna 500 em caso de erro", async () => {
    const req = { body: {}, files: [] };
    const res = makeRes();
    prisma.evento.create.mockRejectedValue(new Error("db error"));

    await createEvento(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("listEventos", () => {
  test("retorna lista de eventos", async () => {
    const req = {};
    const res = makeRes();
    prisma.evento.findMany.mockResolvedValue([eventoBase]);

    await listEventos(req, res);

    expect(res.json).toHaveBeenCalledWith([eventoBase]);
  });

  test("retorna 500 em caso de erro", async () => {
    const res = makeRes();
    prisma.evento.findMany.mockRejectedValue(new Error("db error"));

    await listEventos({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getEvento", () => {
  test("retorna evento pelo ID", async () => {
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.evento.findUnique.mockResolvedValue(eventoBase);

    await getEvento(req, res);

    expect(res.json).toHaveBeenCalledWith(eventoBase);
  });

  test("retorna 404 quando evento não existe", async () => {
    const req = { params: { id: "99" } };
    const res = makeRes();
    prisma.evento.findUnique.mockResolvedValue(null);

    await getEvento(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" } };
    const res = makeRes();

    await getEvento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("retorna 500 em caso de erro", async () => {
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.evento.findUnique.mockRejectedValue(new Error("db error"));

    await getEvento(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("updateEvento", () => {
  test("atualiza evento sem nova imagem", async () => {
    const req = { params: { id: "1" }, body: { name: "Novo nome" }, files: [] };
    const res = makeRes();
    const updated = { ...eventoBase, name: "Novo nome" };
    prisma.evento.findUnique.mockResolvedValue(eventoBase);
    prisma.evento.update.mockResolvedValue(updated);

    await updateEvento(req, res);

    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test("deleta imagem antiga ao enviar nova imagem", async () => {
    const existing = { ...eventoBase, images: [{ id: 1, src: "/uploads/old.jpg" }] };
    const req = { params: { id: "1" }, body: { imagesMantidas: [] }, files: [{ filename: "new.jpg" }] };
    const res = makeRes();
    prisma.evento.findUnique.mockResolvedValue(existing);
    prisma.imagemEvento.deleteMany.mockResolvedValue({});
    prisma.evento.update.mockResolvedValue(eventoBase);
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    await updateEvento(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(eventoBase);
  });

  test("retorna 404 quando evento não existe", async () => {
    const req = { params: { id: "99" }, body: {}, files: [] };
    const res = makeRes();
    prisma.evento.findUnique.mockResolvedValue(null);

    await updateEvento(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" }, body: {}, files: [] };
    const res = makeRes();

    await updateEvento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("deleteEvento", () => {
  test("deleta evento e remove imagens do disco", async () => {
    const existing = { ...eventoBase, images: [{ id: 1, src: "/uploads/img.jpg" }] };
    const req = { params: { id: "1" } };
    const res = makeRes();
    prisma.evento.findUnique.mockResolvedValue(existing);
    prisma.evento.delete.mockResolvedValue({});
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {});

    await deleteEvento(req, res);

    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Evento deletado com sucesso" });
  });

  test("retorna 404 quando evento não existe", async () => {
    const req = { params: { id: "99" } };
    const res = makeRes();
    prisma.evento.findUnique.mockResolvedValue(null);

    await deleteEvento(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("retorna 400 quando ID é inválido", async () => {
    const req = { params: { id: "abc" } };
    const res = makeRes();

    await deleteEvento(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

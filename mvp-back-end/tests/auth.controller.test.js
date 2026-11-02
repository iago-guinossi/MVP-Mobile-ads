const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../src/lib/prisma");
const { register, login } = require("../src/controllers/auth.controller");

jest.mock("../src/lib/prisma", () => ({
  admin: {
    create: jest.fn(),
    findUnique: jest.fn()
  }
}));
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("register", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { email: "admin@test.com", password: "senha123" } };
    res = makeRes();
    jest.clearAllMocks();
  });

  test("cria admin e retorna objeto criado", async () => {
    const adminCriado = { id: 1, email: "admin@test.com", password: "hash" };
    bcrypt.hash.mockResolvedValue("hash");
    prisma.admin.create.mockResolvedValue(adminCriado);

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("senha123", 10);
    expect(prisma.admin.create).toHaveBeenCalledWith({
      data: { email: "admin@test.com", password: "hash" }
    });
    expect(res.json).toHaveBeenCalledWith(adminCriado);
  });

  test("retorna 500 em caso de erro", async () => {
    bcrypt.hash.mockRejectedValue(new Error("hash error"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao registrar admin" });
  });
});

describe("login", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { email: "admin@test.com", password: "senha123" } };
    res = makeRes();
    jest.clearAllMocks();
  });

  test("retorna token quando credenciais são válidas", async () => {
    const admin = { id: 1, email: "admin@test.com", password: "hash" };
    prisma.admin.findUnique.mockResolvedValue(admin);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("jwt-token");

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({ token: "jwt-token" });
  });

  test("retorna 401 quando usuário não existe", async () => {
    prisma.admin.findUnique.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Credenciais inválidas" });
  });

  test("retorna 401 quando senha está errada", async () => {
    prisma.admin.findUnique.mockResolvedValue({ id: 1, email: "admin@test.com", password: "hash" });
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Credenciais inválidas" });
  });

  test("retorna 500 em caso de erro do servidor", async () => {
    prisma.admin.findUnique.mockRejectedValue(new Error("db error"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro no login" });
  });
});

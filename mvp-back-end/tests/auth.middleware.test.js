const jwt = require("jsonwebtoken");
const { verificarToken } = require("../src/middleware/auth");

jest.mock("jsonwebtoken");

function makeRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("verificarToken middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = makeRes();
    next = jest.fn();
  });

  test("retorna 401 quando Authorization header está ausente", () => {
    verificarToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token ausente" });
    expect(next).not.toHaveBeenCalled();
  });

  test("retorna 401 quando token é inválido", () => {
    req.headers["authorization"] = "Bearer token-invalido";
    jwt.verify.mockImplementation((token, secret, cb) => cb(new Error("invalid"), null));

    verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });

  test("chama next() e define req.adminId quando token Bearer é válido", () => {
    req.headers["authorization"] = "Bearer token-valido";
    jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 42 }));

    verificarToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.adminId).toBe(42);
  });

  test("chama next() quando token é enviado sem prefixo Bearer", () => {
    req.headers["authorization"] = "token-direto";
    jwt.verify.mockImplementation((token, secret, cb) => cb(null, { id: 7 }));

    verificarToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.adminId).toBe(7);
  });
});

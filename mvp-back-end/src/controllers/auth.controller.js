const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { SECRET } = require("../middleware/auth");

async function gerarToken(admin) {
  return jwt.sign({ id: admin.id, email: admin.email }, SECRET, { expiresIn: "1d" });
}

async function register(req, res) {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({ data: { email, password: hash } });
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar admin" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const token = await gerarToken(admin);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no login" });
  }
}

module.exports = { register, login };

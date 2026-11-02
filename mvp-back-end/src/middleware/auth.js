const jwt = require("jsonwebtoken");

// Chave lida do .env (JWT_SECRET); nunca deixe a chave escrita no código
const SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token ausente" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.adminId = decoded.id;
    next();
  });
}

module.exports = { verificarToken, SECRET };

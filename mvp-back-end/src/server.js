// Sem a chave, qualquer token seria aceito ou recusado de forma imprevisível: melhor nem subir
if (!process.env.JWT_SECRET) {
  console.error("Defina JWT_SECRET no arquivo .env (veja .env.example) antes de iniciar a API.");
  process.exit(1);
}

const app = require("./app");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

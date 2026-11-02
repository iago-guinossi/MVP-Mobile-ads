const fs = require("fs");

// Apaga do disco os arquivos que o multer já salvou quando a requisição é rejeitada
function discardUploads(files) {
  for (const file of files || []) {
    if (file.path && fs.existsSync(file.path)) {
      try { fs.unlinkSync(file.path); } catch (err) { console.warn("Erro ao descartar upload:", file.path); }
    }
  }
}

module.exports = { discardUploads };

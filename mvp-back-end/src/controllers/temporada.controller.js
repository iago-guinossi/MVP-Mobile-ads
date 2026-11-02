const path = require("path");
const fs = require("fs");
const prisma = require("../lib/prisma");

const PROJECT_ROOT = path.join(__dirname, "..", "..");

async function createTemporada(req, res) {
  try {
    const { text } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const temporada = await prisma.temporada.create({
      data: { text, image }
    });
    res.json(temporada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar temporada" });
  }
}

async function listTemporadas(req, res) {
  try {
    const temporadas = await prisma.temporada.findMany();
    res.json(temporadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar temporadas" });
  }
}

async function getTemporada(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const temporada = await prisma.temporada.findUnique({ where: { id } });
    if (!temporada) return res.status(404).json({ error: "Temporada não encontrada" });

    res.json(temporada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar temporada" });
  }
}

async function updateTemporada(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const existing = await prisma.temporada.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Temporada não encontrada" });

    const { text } = req.body;
    const updateData = {};

    if (text && text.trim() !== "") updateData.text = text;

    if (req.file) {
      if (existing.image) {
        const oldPath = path.join(PROJECT_ROOT, existing.image);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (err) { console.warn("Erro ao deletar imagem antiga:", oldPath); }
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await prisma.temporada.update({
      where: { id },
      data: updateData
    });

    res.json(updated);
  } catch (error) {
    console.error("Erro no PUT:", error);
    res.status(500).json({ error: "Erro ao atualizar temporada" });
  }
}

async function deleteTemporada(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const existing = await prisma.temporada.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Temporada não encontrada" });

    if (existing.image) {
      const fullPath = path.join(PROJECT_ROOT, existing.image);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (err) { console.warn("Erro ao deletar arquivo", fullPath, err); }
      }
    }

    await prisma.temporada.delete({ where: { id } });
    res.json({ message: "Temporada deletada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar temporada" });
  }
}

module.exports = { createTemporada, listTemporadas, getTemporada, updateTemporada, deleteTemporada };

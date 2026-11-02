const path = require("path");
const fs = require("fs");
const prisma = require("../lib/prisma");
const { extractMapUrl } = require("../utils/googleMaps");
const { discardUploads } = require("../utils/uploads");

const PROJECT_ROOT = path.join(__dirname, "..", "..");

async function createTrilha(req, res) {
  try {
    const { name, summary, distance, location, map } = req.body;

    let mapUrl;
    try {
      mapUrl = extractMapUrl(map);
    } catch (err) {
      discardUploads(req.files);
      return res.status(400).json({ error: err.message });
    }

    const filePaths = (req.files || []).map(f => ({ src: `/uploads/${f.filename}` }));

    const trilha = await prisma.trilha.create({
      data: {
        name,
        summary,
        distance,
        location,
        mapUrl,
        images: {
          create: filePaths
        }
      },
      include: { images: true }
    });
    res.json(trilha);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar trilha" });
  }
}

async function listTrilhas(req, res) {
  try {
    const trilhas = await prisma.trilha.findMany({ include: { images: true } });
    res.json(trilhas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar trilhas" });
  }
}

async function getTrilha(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const trilha = await prisma.trilha.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!trilha) return res.status(404).json({ error: "Trilha não encontrada" });

    res.json(trilha);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar trilha" });
  }
}

async function updateTrilha(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const existing = await prisma.trilha.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!existing) return res.status(404).json({ error: "Trilha não encontrada" });

    const { name, summary, distance, location, map, imagesMantidas } = req.body;
    const updateData = {};

    if (name && name.trim() !== "") updateData.name = name;
    if (summary && summary.trim() !== "") updateData.summary = summary;
    if (distance && distance.trim() !== "") updateData.distance = distance;
    if (location && location.trim() !== "") updateData.location = location;

    // "map" só é alterado quando enviado; texto vazio remove o mapa
    if (map !== undefined) {
      try {
        updateData.mapUrl = extractMapUrl(map);
      } catch (err) {
        discardUploads(req.files);
        return res.status(400).json({ error: err.message });
      }
    }

    let mantidasSrcs = [];
    if (imagesMantidas) {
      mantidasSrcs = Array.isArray(imagesMantidas) ? imagesMantidas : [imagesMantidas];
    }

    const imagensParaDeletar = existing.images.filter(imgObj => !mantidasSrcs.includes(imgObj.src));

    for (const imgObj of imagensParaDeletar) {
      const fullPath = path.join(PROJECT_ROOT, imgObj.src);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.warn("Erro ao deletar arquivo antigo do disco:", fullPath);
        }
      }
    }

    if (imagensParaDeletar.length > 0) {
      await prisma.imagemTrilha.deleteMany({
        where: {
          id: { in: imagensParaDeletar.map(img => img.id) }
        }
      });
    }

    const newFiles = req.files || [];

    if (newFiles.length > 0) {
      updateData.images = {
        create: newFiles.map(f => ({ src: `/uploads/${f.filename}` }))
      };
    }

    const updated = await prisma.trilha.update({
      where: { id },
      data: updateData,
      include: { images: true }
    });

    res.json(updated);
  } catch (error) {
    console.error("Erro no PUT:", error);
    res.status(500).json({ error: "Erro ao atualizar trilha" });
  }
}

async function deleteTrilha(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const existing = await prisma.trilha.findUnique({
      where: { id },
      include: { images: true }
    });
    if (!existing) return res.status(404).json({ error: "Trilha não encontrada" });

    for (const imgObj of existing.images) {
      const fullPath = path.join(PROJECT_ROOT, imgObj.src);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (err) { console.warn("Erro ao deletar arquivo", fullPath, err); }
      }
    }

    await prisma.trilha.delete({ where: { id } });
    res.json({ message: "Trilha deletada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar trilha" });
  }
}

module.exports = { createTrilha, listTrilhas, getTrilha, updateTrilha, deleteTrilha };
